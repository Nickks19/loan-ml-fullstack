# loan-ml-fullstack
# Loan Approval Prediction System – Full Stack ML Application

## Overview

This project is a production-style full stack loan approval prediction system. It integrates a machine learning pipeline into a REST API backend and a modern frontend interface.

The objective of this project was to demonstrate end-to-end system design, including structured data preprocessing, model training, pipeline serialization, REST API development, and frontend/backend integration.

The focus of this implementation is on engineering architecture and production-style design rather than experimental modeling.

---

## Tech Stack

### Backend
- Python
- FastAPI
- Scikit-learn
- Pandas
- Uvicorn

### Frontend
- Next.js
- React
- TypeScript

### Machine Learning
- Logistic Regression
- ColumnTransformer preprocessing pipeline
- OneHotEncoder for categorical features
- StandardScaler for numeric features
- Stratified train/test split
- Joblib model serialization

---

## System Architecture

Client (Next.js)
→ FastAPI REST API
→ Scikit-learn Pipeline (Preprocessing + Model)
→ Serialized Artifact
→ JSON Prediction Response

The preprocessing pipeline and model are serialized together as a single artifact:

backend/app/ml/artifacts/loan_model_pipeline.joblib

This ensures consistent transformations between training and inference.

---

## Key Features

- End-to-end ML pipeline integrated into a REST API
- Structured input validation using Pydantic schemas
- Modular backend routing structure
- Serialized model artifact for production-style inference
- Live frontend prediction form
- Clear separation of training and inference logic
- CORS-enabled cross-origin communication
- Organized project structure for scalability

---

## Model Training Summary

- Dataset cleaned and standardized
- Target label converted to binary classification
- Categorical variables encoded using OneHotEncoder
- Numeric features scaled using StandardScaler
- Stratified 80/20 train/test split
- Logistic Regression baseline classifier

### Performance (V1 Dataset)

- Accuracy: ~0.80–0.85
- F1 Score: ~0.78–0.83
- Class balance preserved via stratified split

---

## API Endpoints

### GET /health
Returns service health status.

### POST /predict
Accepts structured loan application JSON and returns:

{
  "prediction": 1,
  "probability": 0.84
}

Input validation ensures type safety and required fields before inference.

---

## Local Development

### Backend

cd backend  
python -m venv venv  
source venv/bin/activate  
pip install -r requirements.txt  
uvicorn app.main:app --reload  

API documentation available at:  
http://127.0.0.1:8000/docs

### Frontend

cd frontend
npm install
npm run dev

Frontend runs at:
http://localhost:3000

---

## Design Decisions

- Used a Scikit-learn Pipeline to prevent preprocessing mismatch between training and inference.
- Serialized the full pipeline artifact rather than separate model and transformer objects.
- Implemented stratified splitting to preserve class distribution.
- Enforced structured API schemas for robust input validation.
- Separated training logic from inference service.
- Modularized route structure to allow future expansion (authentication, history, metrics).

---

## Planned Enhancements

- Replace dataset with LendingClub (US-based financial dataset)
- Add PostgreSQL integration for prediction logging
- Introduce authentication layer
- Add model calibration
- Dockerize backend
- Implement CI/CD pipeline
- Deploy to cloud infrastructure

---

## Objective

This project demonstrates practical full stack engineering skills including:

- API design and implementation
- ML model integration into production services
- Data preprocessing pipeline management
- Frontend/backend communication
- Modular architecture design
- Scalability planning
