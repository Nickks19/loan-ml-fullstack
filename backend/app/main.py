from fastapi import FastAPI
from app.api.routes.predict import router as predict_router
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes.dti import router as dti_router

app = FastAPI(title="Loan ML API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health_check():
    return {"status": "ok"}

app.include_router(predict_router, prefix="/api")
app.include_router(dti_router, prefix="/api")