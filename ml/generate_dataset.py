import pandas as pd
import numpy as np
import random

# ----------------------------
# 1. Define recipe classes
# ----------------------------

TREATMENT_RECIPES = {
    "recipe_1": {
        "description": "Primary: Sedimentation; Secondary: ASP; Tertiary: Sand + ACF",
        "typical_doses": {"alum": 20, "polymer": 0.5, "chlorine": 2, "antiscalant": 0}
    },
    "recipe_2": {
        "description": "Primary: Alum + Sed; Secondary: MBBR; Tertiary: Sand + ACF + UV",
        "typical_doses": {"alum": 35, "polymer": 1, "chlorine": 3, "antiscalant": 0}
    },
    "recipe_3": {
        "description": "Primary: Alum + Sed; Secondary: SBR; Tertiary: RO + UV + Cl2",
        "typical_doses": {"alum": 45, "polymer": 1.5, "chlorine": 4, "antiscalant": 4}
    },
    "recipe_4": {
        "description": "Primary: Sed; Secondary: ASP; Tertiary: RO + UV",
        "typical_doses": {"alum": 10, "polymer": 0.2, "chlorine": 2, "antiscalant": 3}
    }
}

INTENDED_USES = ["Irrigation", "Cooling", "Washing", "Construction", "Industrial"]

# ----------------------------
# 2. Helper functions
# ----------------------------

def determine_pollution_level(bod, cod, tds, turbidity, pH, heavy):
    score = 0
    score += (bod / 300)
    score += (cod / 500)
    score += (tds / 2000)
    score += (turbidity / 200)
    score += abs(pH - 7) * 0.3
    if heavy: score += 1

    if score < 1.5: return "low"
    if score < 2.5: return "medium"
    return "high"


def choose_recipe(level):
    if level == "low":
        return "recipe_1"
    elif level == "medium":
        return random.choice(["recipe_2", "recipe_4"])
    else:
        return "recipe_3"


def randomize_dose(base):
    # introduce ±20% noise around typical values
    return round(base * random.uniform(0.8, 1.2), 2)


# ----------------------------
# 3. Data generation loop
# ----------------------------

def generate_dataset(rows=5000):
    data = []

    for _ in range(rows):

        # random influent values
        pH = round(random.uniform(5, 9), 2)
        tds = random.randint(200, 3000)
        turbidity = random.randint(2, 200)
        bod = random.randint(10, 400)
        cod = random.randint(30, 800)
        temperature = random.randint(15, 40)
        heavy = random.choice([0, 1])
        intended = random.choice(INTENDED_USES)

        # pollution level
        level = determine_pollution_level(bod, cod, tds, turbidity, pH, heavy)

        # select recipe
        recipe = choose_recipe(level)

        # get base doses
        base = TREATMENT_RECIPES[recipe]["typical_doses"]

        # apply randomness
        alum = randomize_dose(base["alum"])
        polymer = randomize_dose(base["polymer"])
        chlorine = randomize_dose(base["chlorine"])
        antiscalant = randomize_dose(base["antiscalant"])

        data.append([
            pH, tds, turbidity, bod, cod, temperature, heavy, intended,
            recipe, alum, polymer, chlorine, antiscalant
        ])

    columns = [
        "pH", "tds", "turbidity", "bod", "cod", "temperature", "heavy_metals",
        "intended_reuse", "recipe_class", "alum_dose", "polymer_dose",
        "chlorine_dose", "antiscalant_dose"
    ]

    df = pd.DataFrame(data, columns=columns)
    df.to_csv("data.csv", index=False)
    print(f"Dataset generated: {len(df)} rows → saved as data.csv")


# Run generator
if __name__ == "__main__":
    generate_dataset(rows=5000)
