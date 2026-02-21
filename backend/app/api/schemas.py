from pydantic import BaseModel, Field

class LoanApplicationRequest(BaseModel):
    loan_amnt: float = Field(..., gt=0)
    term: str = Field(..., description='Example: "36 months"')
    annual_inc: float = Field(..., gt=0)
    fico_range_low: int = Field(..., ge=300, le=850)
    dti: float = Field(..., ge=0)

class LoanPredictionResponse(BaseModel):
    result: str                 # "Approved" or "Rejected"
    probability: float          # confidence in the result
    probability_bad: float      # risk score (debug / transparency)
