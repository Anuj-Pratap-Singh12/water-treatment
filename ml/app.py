# ml/app.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import pandas as pd

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # dev: allow everything; later you can restrict
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# -------- Features (same order as training) --------
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

# -------- Stage column names per type --------
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

# -------- Pydantic input model --------
class DesignInput(BaseModel):
    pH: float
    TDS_mgL: float
    turbidity_NTU: float
    BOD_mgL: float
    COD_mgL: float
    total_nitrogen_mgL: float
    temperature_C: float
    flow_m3_day: float
    heavy_metals: bool  # True/False from frontend


# -------- Load models at startup --------
type_classifier = joblib.load("model_type_classifier.joblib")

TYPE_MODELS = {}  # {type_id: {"time": ..., "equip": ..., "cost": ...}}

for t in range(1, 6):
    TYPE_MODELS[t] = {
        "time": joblib.load(f"model_type{t}_times.joblib"),
        "equip": joblib.load(f"model_type{t}_equipment.joblib"),
        "cost": joblib.load(f"model_type{t}_cost.joblib"),
    }


@app.post("/predict-design")
def predict_design(input_data: DesignInput):
    # Build feature row in correct order
    row = {
        "pH": input_data.pH,
        "TDS_mgL": input_data.TDS_mgL,
        "turbidity_NTU": input_data.turbidity_NTU,
        "BOD_mgL": input_data.BOD_mgL,
        "COD_mgL": input_data.COD_mgL,
        "total_nitrogen_mgL": input_data.total_nitrogen_mgL,
        "temperature_C": input_data.temperature_C,
        "flow_m3_day": input_data.flow_m3_day,
        "heavy_metals": int(input_data.heavy_metals),  # convert bool -> 0/1
    }

    X = pd.DataFrame([row], columns=FEATURE_COLS)

    # 1) Predict type
    predicted_type = int(type_classifier.predict(X)[0])

    # 2) Get correct models for that type
    models = TYPE_MODELS[predicted_type]
    time_model = models["time"]
    equip_model = models["equip"]
    cost_model = models["cost"]

    # 3) Predict times
    time_cols = TIME_COLS_BY_TYPE[predicted_type]
    times_pred = time_model.predict(X)[0]
    stage_times = {
        col: round(float(val), 2) for col, val in zip(time_cols, times_pred)
    }

    # 4) Predict equipment
    equip_cols = EQUIP_COLS_BY_TYPE[predicted_type]
    equip_pred = equip_model.predict(X)[0]
    stage_equipment = {
        col: str(val) for col, val in zip(equip_cols, equip_pred)
    }

    # 5) Predict cost
    cost_per_m3 = float(cost_model.predict(X)[0])

    return {
        "predicted_type": predicted_type,
        "stage_times_min": stage_times,
        "stage_equipment": stage_equipment,
        "cost_per_m3_inr": round(cost_per_m3, 2),
    }
