from fastapi import FastAPI

app = FastAPI(title="Loan ML API")

@app.get("/health")
def health_check():
    return {"status": "ok"}
