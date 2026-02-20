from fastapi import APIRouter
from app.api.schemas import LoanApplicationRequest, LoanPredictionResponse
from app.ml.predict import LoanModel

router = APIRouter()

model = LoanModel()

@router.post("/predict", response_model=LoanPredictionResponse)
def predict_loan(req: LoanApplicationRequest):
    result = model.predict(req.model_dump())
    return result
