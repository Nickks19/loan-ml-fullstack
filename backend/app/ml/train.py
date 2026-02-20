import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.compose import ColumnTransformer
import joblib

from config import (
    FEATURE_COLUMNS,
    TARGET_COLUMN,
    GOOD_LABEL,
    BAD_LABEL,
    MODEL_PATH
)


def load_data(csv_path: str):
    """
    Load only required columns from LendingClub dataset and filter labels.
    """
    usecols = FEATURE_COLUMNS + [TARGET_COLUMN]

    df = pd.read_csv(csv_path, usecols=usecols, low_memory=False)

    # Keep only relevant rows
    df = df[df[TARGET_COLUMN].isin([GOOD_LABEL, BAD_LABEL])].copy()

    # Convert target to binary
    df["target"] = df[TARGET_COLUMN].map({GOOD_LABEL: 0, BAD_LABEL: 1})

    return df



def clean_features(df: pd.DataFrame):
    """
    Minimal cleaning for V2.
    """

    df = df[FEATURE_COLUMNS + ["target"]].copy()

    # Convert term: "36 months" → 36
    df["term"] = df["term"].str.extract(r"(\d+)").astype(int)

    # Drop missing rows (simple for V2)
    df = df.dropna()

    return df


def train(csv_path: str):

    df = load_data(csv_path)
    df = clean_features(df)

    X = df[FEATURE_COLUMNS]
    y = df["target"]

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )

    numeric_features = FEATURE_COLUMNS

    preprocessor = ColumnTransformer(
        transformers=[
            ("num", StandardScaler(), numeric_features)
        ]
    )

    pipeline = Pipeline(
        steps=[
            ("preprocessor", preprocessor),
            ("classifier", LogisticRegression(max_iter=1000))
        ]
    )

    pipeline.fit(X_train, y_train)

    accuracy = pipeline.score(X_test, y_test)
    print(f"Model Accuracy: {accuracy:.4f}")

    joblib.dump(pipeline, MODEL_PATH)
    print("Model saved!")


if __name__ == "__main__":
    train("backend/data/accepted.csv")
