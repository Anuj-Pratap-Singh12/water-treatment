# ml/app.py
from fastapi import FastAPI
from pydantic import BaseModel
import joblib
import pandas as pd  # 👈 ADD THIS

app = FastAPI()

recipe_model = joblib.load("model_recipe.pkl")
dose_model = joblib.load("model_dose.pkl")

class WaterInput(BaseModel):
    pH: float
    tds: float
    turbidity: float
    bod: float
    cod: float
    temperature: float
    heavy_metals: bool
    intended_reuse: str

@app.post("/predict")
def predict(input_data: WaterInput):
    # Build a single-row DataFrame with same columns used in training
    row = {
        "pH": input_data.pH,
        "tds": input_data.tds,
        "turbidity": input_data.turbidity,
        "bod": input_data.bod,
        "cod": input_data.cod,
        "temperature": input_data.temperature,
        "heavy_metals": int(input_data.heavy_metals),
        "intended_reuse": input_data.intended_reuse,
    }

    X = pd.DataFrame([row])  # 👈 This is now a 1xN DataFrame

    # Predict recipe class
    recipe = recipe_model.predict(X)[0]

    # Predict chemical doses (multi-output regressor)
    doses = dose_model.predict(X)[0]
    alum_dose, polymer_dose, chlorine_dose, antiscalant_dose = doses

    return {
        "recipe_class": recipe,
        "chemical_doses": {
            "alum": round(float(alum_dose), 2),
            "polymer": round(float(polymer_dose), 2),
            "chlorine": round(float(chlorine_dose), 2),
            "antiscalant": round(float(antiscalant_dose), 2),
        },
    }
