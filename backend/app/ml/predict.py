from __future__ import annotations

from pathlib import Path
import joblib
import pandas as pd


BASE_DIR = Path(__file__).resolve().parents[2]
ARTIFACT_PATH = BASE_DIR / "app" / "ml" / "artifacts" / "loan_model_pipeline.joblib"


def load_model():
    """
    Purpose:
    - Load saved pipeline (preprocessing + model)
    - Keep inference identical to training
    """
    artifact = joblib.load(ARTIFACT_PATH)
    return artifact["pipeline"]


def predict_single(input_dict: dict) -> dict:
    """
    Purpose:
    - Convert input JSON to DataFrame
    - Run through pipeline
    - Return prediction + probability
    """
    model = load_model()

    input_df = pd.DataFrame([input_dict])

    prediction = model.predict(input_df)[0]
    probability = model.predict_proba(input_df)[0][1]

    return {
        "prediction": int(prediction),
        "probability": float(probability)
    }


if __name__ == "__main__":
    # Example test input
    sample_input = {
        "no_of_dependents": 2,
        "education": "Graduate",
        "self_employed": "No",
        "income_annum": 9600000,
        "loan_amount": 2990000,
        "loan_term": 20,
        "cibil_score": 700,
        "residential_assets_value": 4000000,
        "commercial_assets_value": 1760000,
        "luxury_assets_value": 2270000,
        "bank_asset_value": 800000
    }

    result = predict_single(sample_input)
    print(result)
