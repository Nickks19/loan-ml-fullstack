FEATURE_COLUMNS = [
    "loan_amnt",
    "term",
    "annual_inc",
    "fico_range_low",
    "dti",
]

TARGET_COLUMN = "loan_status"

GOOD_LABEL = "Fully Paid"
BAD_LABEL = "Charged Off"

MODEL_PATH = "app/ml/artifacts/loan_model_pipeline.joblib"