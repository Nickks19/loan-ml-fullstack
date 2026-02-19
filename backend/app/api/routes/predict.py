from fastapi import APIRouter, HTTPException
from app.api.schemas import LoanApplication, PredictionResponse
from app.ml.predict import predict_single

router = APIRouter()

@router.post("/predict", response_model=PredictionResponse)
def predict(payload: LoanApplication):
    try:
        result = predict_single(payload.model_dump())
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
