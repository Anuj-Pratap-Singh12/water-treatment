import joblib
import pandas as pd

# Same feature order as during training
FEATURE_COLS = [
    "pH",
    "TDS_mgL",
    "turbidity_NTU",
    "BOD_mgL",
    "COD_mgL",
    "total_nitrogen_mgL",
    "temperature_C",
    "flow_m3_day",
    "heavy_metals",
]


# ----------------- Helpers: column maps per type -----------------

TIME_COLS_BY_TYPE = {
    1: [
        "t_screening_min",
        "t_coag_floc_min",
        "t_sedimentation_min",
        "t_filtration_min",
        "t_carbon_polishing_min",
        "t_disinfection_min",
    ],
    2: [
        "t_screening_min",
        "t_oil_grease_min",
        "t_equalization_min",
        "t_coag_floc_min",
        "t_primary_clarifier_min",
        "t_aeration_min",
        "t_secondary_clarifier_min",
        "t_filtration_min",
        "t_disinfection_min",
    ],
    3: [
        "t_screening_min",
        "t_grit_chamber_min",
        "t_equalization_min",
        "t_biological_reactor_min",
        "t_mbr_min",
        "t_activated_carbon_min",
        "t_disinfection_min",
    ],
    4: [
        "t_screening_min",
        "t_neutralization_min",
        "t_precipitation_min",
        "t_heavy_metal_removal_min",
        "t_filter_press_min",
        "t_carbon_filter_min",
        "t_ro_min",
    ],
    5: [
        "t_screening_min",
        "t_anaerobic_reactor_min",
        "t_biogas_handling_min",
        "t_aeration_min",
        "t_secondary_clarifier_min",
        "t_sludge_handling_min",
        "t_tertiary_filtration_min",
    ],
}

EQUIP_COLS_BY_TYPE = {
    1: [
        "equip_screening",
        "equip_coag_floc",
        "equip_sedimentation",
        "equip_filtration",
        "equip_carbon_polishing",
        "equip_disinfection",
    ],
    2: [
        "equip_screening",
        "equip_oil_grease",
        "equip_equalization",
        "equip_coag_floc",
        "equip_primary_clarifier",
        "equip_aeration",
        "equip_secondary_clarifier",
        "equip_filtration",
        "equip_disinfection",
    ],
    3: [
        "equip_screening",
        "equip_grit_chamber",
        "equip_equalization",
        "equip_biological_reactor",
        "equip_mbr",
        "equip_activated_carbon",
        "equip_disinfection",
    ],
    4: [
        "equip_screening",
        "equip_neutralization",
        "equip_precipitation",
        "equip_heavy_metal_removal",
        "equip_filter_press",
        "equip_carbon_filter",
        "equip_ro",
    ],
    5: [
        "equip_screening",
        "equip_anaerobic_reactor",
        "equip_biogas_handling",
        "equip_aeration",
        "equip_secondary_clarifier",
        "equip_sludge_handling",
        "equip_tertiary_filtration",
    ],
}


def load_models_for_type(type_id: int):
    """Load time, equipment & cost models for a given type."""
    time_model_path = f"model_type{type_id}_times.joblib"
    equip_model_path = f"model_type{type_id}_equipment.joblib"
    cost_model_path = f"model_type{type_id}_cost.joblib"

    time_model = joblib.load(time_model_path)
    equip_model = joblib.load(equip_model_path)
    cost_model = joblib.load(cost_model_path)

    return time_model, equip_model, cost_model


def predict_design(sample: dict):
    """
    sample: dict with keys matching FEATURE_COLS.
    Example:
      {
        "pH": 7.2,
        "TDS_mgL": 1200,
        "turbidity_NTU": 120,
        ...
      }
    """
    # Convert to DataFrame in correct column order
    X = pd.DataFrame([sample], columns=FEATURE_COLS)

    # 1) Predict type
    type_clf = joblib.load("model_type_classifier.joblib")
    predicted_type = int(type_clf.predict(X)[0])

    print(f"\nPredicted Type: {predicted_type}")

    # 2) Load per-type models
    time_model, equip_model, cost_model = load_models_for_type(predicted_type)

    # 3) Predict stage times
    time_cols = TIME_COLS_BY_TYPE[predicted_type]
    times_pred = time_model.predict(X)[0]  # 1D array

    # 4) Predict equipment
    equip_cols = EQUIP_COLS_BY_TYPE[predicted_type]
    equip_pred = equip_model.predict(X)[0]  # list/array of labels

    # 5) Predict cost per m3
    cost_per_m3 = float(cost_model.predict(X)[0])

    # Pack results nicely
    stage_times = {col: float(val) for col, val in zip(time_cols, times_pred)}
    stage_equipment = {col: str(val) for col, val in zip(equip_cols, equip_pred)}

    return {
        "predicted_type": predicted_type,
        "stage_times_min": stage_times,
        "stage_equipment": stage_equipment,
        "cost_per_m3_inr": cost_per_m3,
    }


if __name__ == "__main__":
    # Example using YOUR given values:
    # pH 7.2
    # TDS 1200 mg/L
    # Turbidity 120 NTU
    # BOD 200 mg/L
    # COD 500 mg/L
    # Total Nitrogen 45 mg/L
    # Temperature 30 °C
    # Flow 1000 m3/day
    # Heavy metals present in significant concentration -> 1
    sample = {
        "pH": 7.2,
        "TDS_mgL": 1200,
        "turbidity_NTU": 120,
        "BOD_mgL": 200,
        "COD_mgL": 500,
        "total_nitrogen_mgL": 45,
        "temperature_C": 30,
        "flow_m3_day": 1000,
        "heavy_metals": 1,
    }

    result = predict_design(sample)

    print("\n=== PREDICTION RESULT ===")
    print("Type:", result["predicted_type"])
    print("\nStage times (minutes):")
    for k, v in result["stage_times_min"].items():
        print(f"  {k}: {v:.2f} min")

    print("\nStage equipment:")
    for k, v in result["stage_equipment"].items():
        print(f"  {k}: {v}")

    print(f"\nEstimated Cost: {result['cost_per_m3_inr']:.2f} INR/m³")
