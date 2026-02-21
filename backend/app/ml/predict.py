import joblib
import pandas as pd

from .config import FEATURE_COLUMNS, MODEL_PATH

APPROVAL_THRESHOLD = 0.35  # tweak later

def parse_term(term: str) -> int:
    # "36 months" -> 36
    return int(str(term).strip().split()[0])

class LoanModel:
    def __init__(self):
        self.pipeline = joblib.load(MODEL_PATH)

    def predict(self, input_data: dict):
        # 1) Build one clean row that matches training features
        row = {
            "loan_amnt": float(input_data["loan_amnt"]),
            "term": parse_term(input_data["term"]),
            "annual_inc": float(input_data["annual_inc"]),
            "fico_range_low": int(input_data["fico_range_low"]),
            "dti": float(input_data["dti"]),
        }

        # 2) Convert row -> DataFrame = X
        X = pd.DataFrame([row], columns=FEATURE_COLUMNS)

        # 3) Model outputs probability of "bad" class (Charged Off = 1)
        proba_bad = float(self.pipeline.predict_proba(X)[0][1])

        # 4) Decision layer
        approved = proba_bad < APPROVAL_THRESHOLD
        result = "Approved" if approved else "Rejected"
        probability = (1 - proba_bad) if approved else proba_bad

        return {
            "result": result,
            "probability": float(probability),
            "probability_bad": float(proba_bad),
        }
