import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor
import joblib

# 1. Load dataset
df = pd.read_csv("data.csv")

# 2. Feature columns
feature_cols = [
    "pH", "tds", "turbidity", "bod", "cod",
    "temperature", "heavy_metals", "intended_reuse"
]

X = df[feature_cols]

# 3. Target columns
y_recipe = df["recipe_class"]
y_doses = df[["alum_dose", "polymer_dose", "chlorine_dose", "antiscalant_dose"]]

# 4. Preprocess
numeric_features = ["pH", "tds", "turbidity", "bod", "cod", "temperature"]
categorical_features = ["heavy_metals", "intended_reuse"]

numeric_transformer = Pipeline([
    ("scaler", StandardScaler())
])

categorical_transformer = Pipeline([
    ("onehot", OneHotEncoder(handle_unknown="ignore"))
])

preprocess = ColumnTransformer([
    ("num", numeric_transformer, numeric_features),
    ("cat", categorical_transformer, categorical_features)
])

# 5. Recipe classifier model
clf = Pipeline([
    ("preprocess", preprocess),
    ("model", RandomForestClassifier(n_estimators=200, random_state=42))
])

# 6. Chemical dosage regressor (multi-output)
reg = Pipeline([
    ("preprocess", preprocess),
    ("model", RandomForestRegressor(n_estimators=200, random_state=42))
])

# 7. Train-test split
X_train, X_test, y_recipe_train, y_recipe_test = train_test_split(
    X, y_recipe, test_size=0.2, random_state=42
)

_, _, y_doses_train, y_doses_test = train_test_split(
    X, y_doses, test_size=0.2, random_state=42
)

# 8. Train models
clf.fit(X_train, y_recipe_train)
reg.fit(X_train, y_doses_train)

print("Recipe Classifier Train Accuracy:", clf.score(X_train, y_recipe_train))
print("Recipe Classifier Test Accuracy:", clf.score(X_test, y_recipe_test))

print("Dose Regressor Train R²:", reg.score(X_train, y_doses_train))
print("Dose Regressor Test R²:", reg.score(X_test, y_doses_test))

# 9. Save models
joblib.dump(clf, "model_recipe.pkl")
joblib.dump(reg, "model_dose.pkl")

print("Models saved as model_recipe.pkl and model_dose.pkl")
