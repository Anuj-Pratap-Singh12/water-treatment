"""
Train ML models for:
- Type classifier (1–5) using synthetic_designs_all_types.csv
- Per-type models (time, equipment, cost) using type-wise CSVs

Prereq: run your generator script first so these files exist:
  - type1_potable_synthetic.csv
  - type2_domestic_synthetic.csv
  - type3_recycle_mbr_synthetic.csv
  - type4_industrial_synthetic.csv
  - type5_high_organic_synthetic.csv
  - synthetic_designs_all_types.csv
"""

import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor
from sklearn.multioutput import MultiOutputClassifier
from sklearn.metrics import accuracy_score, mean_absolute_error
import joblib


# ---------------------- COMMON FEATURE COLUMNS ----------------------

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


# ---------------------- 1. TYPE CLASSIFIER (1–5) ----------------------

def train_type_classifier():
    print("\n=== Training TYPE classifier (1–5) ===")
    df_all = pd.read_csv("synthetic_designs_all_types.csv")

    # Filter to rows that have type and all features (should be all rows)
    df_all = df_all.dropna(subset=["type"] + FEATURE_COLS)

    X = df_all[FEATURE_COLS]
    y_type = df_all["type"].astype(int)

    X_train, X_test, y_train, y_test = train_test_split(
        X, y_type, test_size=0.2, random_state=42, stratify=y_type
    )

    clf = RandomForestClassifier(
        n_estimators=400,
        random_state=42,
        n_jobs=-1
    )

    clf.fit(X_train, y_train)
    y_pred = clf.predict(X_test)

    acc = accuracy_score(y_test, y_pred)
    print(f"Type classifier accuracy: {acc:.3f}")

    joblib.dump(clf, "model_type_classifier.joblib")
    print("Saved: model_type_classifier.joblib")


# ---------------------- 2. PER-TYPE MODELS ----------------------

def train_type_models(
    type_id: int,
    csv_path: str,
    time_cols: list,
    equip_cols: list,
    cost_col: str = "cost_per_m3_inr",
):
    print(f"\n=== Training models for TYPE {type_id} from {csv_path} ===")

    df = pd.read_csv(csv_path)
    # Basic cleaning: drop any rows with missing in inputs/outputs
    df = df.dropna(subset=FEATURE_COLS + time_cols + equip_cols + [cost_col])

    X = df[FEATURE_COLS]

    # ----- Time model (multi-output regression) -----
    y_time = df[time_cols]

    X_train_t, X_test_t, y_train_t, y_test_t = train_test_split(
        X, y_time, test_size=0.2, random_state=42
    )

    time_model = RandomForestRegressor(
        n_estimators=400,
        random_state=42,
        n_jobs=-1
    )

    time_model.fit(X_train_t, y_train_t)
    y_pred_t = time_model.predict(X_test_t)

    mae_time = mean_absolute_error(y_test_t, y_pred_t)
    print(f"[Type {type_id}] Stage-time MAE (minutes): {mae_time:.2f}")

    time_model_path = f"model_type{type_id}_times.joblib"
    joblib.dump(time_model, time_model_path)
    print(f"Saved: {time_model_path}")

    # ----- Equipment model (multi-output classification) -----
    y_equip = df[equip_cols]

    X_train_e, X_test_e, y_train_e, y_test_e = train_test_split(
        X, y_equip, test_size=0.2, random_state=42
    )

    equip_model = MultiOutputClassifier(
        RandomForestClassifier(
            n_estimators=400,
            random_state=42,
            n_jobs=-1
        )
    )

    equip_model.fit(X_train_e, y_train_e)
    y_pred_e = equip_model.predict(X_test_e)

    print(f"[Type {type_id}] Equipment classification accuracies:")
    for i, col in enumerate(equip_cols):
        col_pred = [row[i] for row in y_pred_e]
        acc = accuracy_score(y_test_e[col], col_pred)
        print(f"  {col}: {acc:.3f}")

    equip_model_path = f"model_type{type_id}_equipment.joblib"
    joblib.dump(equip_model, equip_model_path)
    print(f"Saved: {equip_model_path}")

    # ----- Cost model (regression) -----
    y_cost = df[cost_col]

    X_train_c, X_test_c, y_train_c, y_test_c = train_test_split(
        X, y_cost, test_size=0.2, random_state=42
    )

    cost_model = RandomForestRegressor(
        n_estimators=400,
        random_state=42,
        n_jobs=-1
    )

    cost_model.fit(X_train_c, y_train_c)
    y_pred_c = cost_model.predict(X_test_c)

    mae_cost = mean_absolute_error(y_test_c, y_pred_c)
    print(f"[Type {type_id}] Cost MAE (INR/m3): {mae_cost:.2f}")

    cost_model_path = f"model_type{type_id}_cost.joblib"
    joblib.dump(cost_model, cost_model_path)
    print(f"Saved: {cost_model_path}")


# ---------------------- MAIN ----------------------

if __name__ == "__main__":
    # 1. Type classifier
    train_type_classifier()

    # 2. Per-type models

    # ---- TYPE 1: Drinking / Potable ----
    type1_time_cols = [
        "t_screening_min",
        "t_coag_floc_min",
        "t_sedimentation_min",
        "t_filtration_min",
        "t_carbon_polishing_min",
        "t_disinfection_min",
    ]
    type1_equip_cols = [
        "equip_screening",
        "equip_coag_floc",
        "equip_sedimentation",
        "equip_filtration",
        "equip_carbon_polishing",
        "equip_disinfection",
    ]
    train_type_models(
        type_id=1,
        csv_path="type1_potable_synthetic.csv",
        time_cols=type1_time_cols,
        equip_cols=type1_equip_cols,
    )

    # ---- TYPE 2: Domestic / Grey Water (STP) ----
    type2_time_cols = [
        "t_screening_min",
        "t_oil_grease_min",
        "t_equalization_min",
        "t_coag_floc_min",
        "t_primary_clarifier_min",
        "t_aeration_min",
        "t_secondary_clarifier_min",
        "t_filtration_min",
        "t_disinfection_min",
    ]
    type2_equip_cols = [
        "equip_screening",
        "equip_oil_grease",
        "equip_equalization",
        "equip_coag_floc",
        "equip_primary_clarifier",
        "equip_aeration",
        "equip_secondary_clarifier",
        "equip_filtration",
        "equip_disinfection",
    ]
    train_type_models(
        type_id=2,
        csv_path="type2_domestic_synthetic.csv",
        time_cols=type2_time_cols,
        equip_cols=type2_equip_cols,
    )

    # ---- TYPE 3: Recycle Grade (MBR) ----
    type3_time_cols = [
        "t_screening_min",
        "t_grit_chamber_min",
        "t_equalization_min",
        "t_biological_reactor_min",
        "t_mbr_min",
        "t_activated_carbon_min",
        "t_disinfection_min",
    ]
    type3_equip_cols = [
        "equip_screening",
        "equip_grit_chamber",
        "equip_equalization",
        "equip_biological_reactor",
        "equip_mbr",
        "equip_activated_carbon",
        "equip_disinfection",
    ]
    train_type_models(
        type_id=3,
        csv_path="type3_recycle_mbr_synthetic.csv",
        time_cols=type3_time_cols,
        equip_cols=type3_equip_cols,
    )

    # ---- TYPE 4: Industrial Effluent ----
    type4_time_cols = [
        "t_screening_min",
        "t_neutralization_min",
        "t_precipitation_min",
        "t_heavy_metal_removal_min",
        "t_filter_press_min",
        "t_carbon_filter_min",
        "t_ro_min",
    ]
    type4_equip_cols = [
        "equip_screening",
        "equip_neutralization",
        "equip_precipitation",
        "equip_heavy_metal_removal",
        "equip_filter_press",
        "equip_carbon_filter",
        "equip_ro",
    ]
    train_type_models(
        type_id=4,
        csv_path="type4_industrial_synthetic.csv",
        time_cols=type4_time_cols,
        equip_cols=type4_equip_cols,
    )

    # ---- TYPE 5: High Organic Load ----
    type5_time_cols = [
        "t_screening_min",
        "t_anaerobic_reactor_min",
        "t_biogas_handling_min",
        "t_aeration_min",
        "t_secondary_clarifier_min",
        "t_sludge_handling_min",
        "t_tertiary_filtration_min",
    ]
    type5_equip_cols = [
        "equip_screening",
        "equip_anaerobic_reactor",
        "equip_biogas_handling",
        "equip_aeration",
        "equip_secondary_clarifier",
        "equip_sludge_handling",
        "equip_tertiary_filtration",
    ]
    train_type_models(
        type_id=5,
        csv_path="type5_high_organic_synthetic.csv",
        time_cols=type5_time_cols,
        equip_cols=type5_equip_cols,
    )

    print("\n✅ All models trained and saved.")
