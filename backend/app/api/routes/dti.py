from fastapi import APIRouter
from pydantic import BaseModel, Field

router = APIRouter()

class DTIRequest(BaseModel):
    annual_inc: float = Field(..., gt=0)
    monthly_debt_payment: float = Field(..., ge=0)

class DTIResponse(BaseModel):
    dti: float  # percent

@router.post("/compute-dti", response_model=DTIResponse)
def compute_dti(req: DTIRequest):
    monthly_income = req.annual_inc / 12.0
    dti = (req.monthly_debt_payment / monthly_income) * 100.0
    return {"dti": round(dti, 2)}
