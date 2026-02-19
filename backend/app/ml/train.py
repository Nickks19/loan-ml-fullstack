from __future__ import annotations

from pathlib import Path
import joblib
import pandas as pd

from sklearn.model_selection import train_test_split
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.impute import SimpleImputer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, f1_score, classification_report


BASE_DIR = Path(__file__).resolve().parents[2]  # points to backend/
DATA_PATH = BASE_DIR / "data" / "loan_approval_dataset.csv"
ARTIFACT_DIR = Path(__file__).resolve().parent / "artifacts"
ARTIFACT_DIR.mkdir(parents=True, exist_ok=True)


def load_and_clean_data(path: Path) -> pd.DataFrame:
    """
    Purpose:
    - Load raw CSV
    - Standardize column names
    - Drop non-predictive ID column
    - Clean & convert target label into 0/1
    """
    df = pd.read_csv(path)
    df.columns = df.columns.str.strip()

    # Drop ID if present (some datasets include it)
    if "loan_id" in df.columns:
        df = df.drop(columns=["loan_id"])

    # Clean target strings + map to binary
    df["loan_status"] = df["loan_status"].astype(str).str.strip()
    df["loan_status"] = df["loan_status"].map({"Approved": 1, "Rejected": 0})

    # Optional sanity check: ensure no unmapped values
    if df["loan_status"].isna().any():
        bad_vals = df.loc[df["loan_status"].isna(), "loan_status"].unique()
        raise ValueError(f"Unmapped loan_status values found: {bad_vals}")

    return df


def build_pipeline(categorical_features: list[str], numeric_features: list[str]) -> Pipeline:
    """
    Purpose:
    - Define preprocessing steps for each feature type
    - Attach a model to the end
    - Produce one consistent object we can save + reuse
    """
    categorical_transformer = Pipeline(
        steps=[
            ("imputer", SimpleImputer(strategy="most_frequent")),
            ("onehot", OneHotEncoder(handle_unknown="ignore")),
        ]
    )

    numeric_transformer = Pipeline(
        steps=[
            ("imputer", SimpleImputer(strategy="median")),
            ("scaler", StandardScaler()),
        ]
    )

    preprocessor = ColumnTransformer(
        transformers=[
            ("cat", categorical_transformer, categorical_features),
            ("num", numeric_transformer, numeric_features),
        ]
    )

    model = LogisticRegression(max_iter=2000)

    clf = Pipeline(
        steps=[
            ("preprocessor", preprocessor),
            ("model", model),
        ]
    )

    return clf


def main() -> None:
    df = load_and_clean_data(DATA_PATH)

    print("\n=== Feature Ranges ===")
    print(df[["income_annum","loan_amount","loan_term","cibil_score"]].describe())

    print("\n=== Class Balance ===")
    print(df["loan_status"].value_counts(normalize=True))


    target = "loan_status"
    categorical_features = ["education", "self_employed"]
    numeric_features = [c for c in df.columns if c not in categorical_features + [target]]

    X = df[categorical_features + numeric_features]
    y = df[target]

    # Purpose: hold-out test set so we can report honest performance
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    clf = build_pipeline(categorical_features, numeric_features)

    clf.fit(X_train, y_train)

    y_pred = clf.predict(X_test)

    acc = accuracy_score(y_test, y_pred)
    f1 = f1_score(y_test, y_pred)

    print("\n=== Baseline Model Results ===")
    print(f"Accuracy: {acc:.4f}")
    print(f"F1 Score:  {f1:.4f}")
    print("\nClassification Report:")
    print(classification_report(y_test, y_pred))

    # Save ONE pipeline artifact that includes preprocessing + model
    artifact_path = ARTIFACT_DIR / "loan_model_pipeline.joblib"
    joblib.dump(
        {
            "pipeline": clf,
            "categorical_features": categorical_features,
            "numeric_features": numeric_features,
            "target": target,
        },
        artifact_path
    )

    print(f"\nSaved model pipeline to: {artifact_path}")


if __name__ == "__main__":
    main()

