import joblib
import pandas as pd
from pathlib import Path

from .config import FEATURE_COLUMNS, MODEL_PATH

def parse_term(term: str) -> int:
    return int(term.strip().split()[0])

class LoanModel:
    def __init__(self):
        self.pipeline = joblib.load(MODEL_PATH)

    def predict(self, input_data: dict):
        row = {
            "loan_amnt": float(input_data["loan_amnt"]),
            "term": parse_term(input_data["term"]),
            "annual_inc": float(input_data["annual_inc"]),
            "fico_range_low": int(input_data["fico_range_low"]),
            "dti": float(input_data["dti"]),
        }

        X = pd.DataFrame([row], columns=FEATURE_COLUMNS)

        proba_bad = float(self.pipeline.predict_proba(X)[0][1])
        pred = int(self.pipeline.predict(X)[0])  # 0=good, 1=bad

        return {
            "approved": pred == 0,
            "probability_bad": proba_bad
        }
