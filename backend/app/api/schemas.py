from pydantic import BaseModel, Field


class LoanApplication(BaseModel):
    no_of_dependents: int = Field(ge=0, le=20)
    education: str
    self_employed: str
    income_annum: float = Field(ge=0)
    loan_amount: float = Field(ge=0)
    loan_term: int = Field(ge=1)
    cibil_score: int = Field(ge=300, le=900)
    residential_assets_value: float = Field(ge=0)
    commercial_assets_value: float = Field(ge=0)
    luxury_assets_value: float = Field(ge=0)
    bank_asset_value: float = Field(ge=0)


class PredictionResponse(BaseModel):
    prediction: int
    probability: float
