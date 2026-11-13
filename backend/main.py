"""
FastAPI Server for Software Defect Detection Platform
Provides complete endpoints for datasets, training, predictions, benchmarks, and uploads.
"""
import os
import shutil
from typing import Dict, Any, Optional
from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from ml.preprocessor import load_dataset, get_dataset_metadata, DATASET_CONFIGS
from ml.models import get_classifiers, get_scalers
from ml.trainer import train_model
from ml.predictor import predict_defect
from ml.benchmark_cache import get_benchmarks

app = FastAPI(
    title="Software Defect Detection API",
    description="Machine learning API for predicting software module defects based on McCabe and Halstead metrics.",
    version="1.0.0"
)

# CORS setup for Vercel, Render, and local development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["GET", "POST", "OPTIONS", "HEAD"],
    allow_headers=["*"],
)

# Use /tmp for uploads if read-only filesystem or serverless
UPLOAD_DIR = os.path.join('/tmp', 'uploads') if os.path.exists('/tmp') else os.path.join(os.path.dirname(__file__), 'uploads')
try:
    os.makedirs(UPLOAD_DIR, exist_ok=True)
except Exception:
    pass


class TrainRequest(BaseModel):
    dataset: str = "jm1"
    classifier: str = "RandomForest"
    normalization: str = "Standard"
    custom_dataset_id: Optional[str] = None


class PredictRequest(BaseModel):
    dataset: str = "jm1"
    classifier: str = "RandomForest"
    normalization: str = "Standard"
    features: Dict[str, Any]


@app.get("/")
def root():
    return {
        "status": "online",
        "service": "Software Defect Detection API",
        "version": "1.0.0",
        "endpoints": ["/api/health", "/api/datasets", "/api/models", "/api/comparison", "/api/train", "/api/predict"]
    }


@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "available_datasets": list(DATASET_CONFIGS.keys()),
        "available_classifiers": list(get_classifiers().keys()),
        "available_normalizations": list(get_scalers().keys())
    }


@app.get("/api/models")
def get_available_models():
    return {
        "classifiers": [
            {"id": "LogisticRegression", "name": "Logistic Regression", "type": "Linear Model"},
            {"id": "Perceptron", "name": "Perceptron", "type": "Single-Layer Linear"},
            {"id": "LinearSVM", "name": "Support Vector Machine (Linear)", "type": "SVM"},
            {"id": "RBFSVM", "name": "Support Vector Machine (RBF Kernel)", "type": "Kernel SVM"},
            {"id": "DecisionTree", "name": "Decision Tree", "type": "Tree-based"},
            {"id": "RandomForest", "name": "Random Forest", "type": "Ensemble"},
            {"id": "NeuralNetwork", "name": "Feed-Forward Neural Network", "type": "Multi-Layer Perceptron"}
        ],
        "normalizations": [
            {"id": "None", "name": "No Normalization", "description": "Raw unscaled features"},
            {"id": "MinMax", "name": "Min-Max Normalization", "description": "Scales features to range [0, 1]"},
            {"id": "Standard", "name": "Feature Standardization", "description": "Zero mean, unit variance scaling"}
        ]
    }


@app.get("/api/datasets")
def list_datasets():
    results = []
    for name in DATASET_CONFIGS.keys():
        meta = get_dataset_metadata(name)
        results.append(meta)
    return results


@app.get("/api/datasets/{name}")
def get_dataset(name: str):
    name_clean = name.lower()
    if name_clean not in DATASET_CONFIGS:
        raise HTTPException(status_code=404, detail=f"Dataset '{name}' not found")
    return get_dataset_metadata(name_clean)


@app.post("/api/datasets/upload")
async def upload_dataset(file: UploadFile = File(...)):
    if not file.filename.endswith('.csv'):
        raise HTTPException(status_code=400, detail="Only CSV files are supported")
    
    file_id = f"upload_{file.filename}"
    file_path = os.path.join(UPLOAD_DIR, file_id)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    try:
        meta = get_dataset_metadata("custom", custom_file_path=file_path)
        meta['custom_id'] = file_id
        return meta
    except Exception as e:
        if os.path.exists(file_path):
            os.remove(file_path)
        raise HTTPException(status_code=400, detail=f"Failed to process CSV: {str(e)}")


@app.get("/api/comparison")
def get_model_comparison(dataset: str = "jm1"):
    benchmarks = get_benchmarks(dataset)
    return {
        "dataset": dataset,
        "results": benchmarks
    }


@app.post("/api/train")
def train_endpoint(req: TrainRequest):
    custom_path = None
    if req.custom_dataset_id:
        custom_path = os.path.join(UPLOAD_DIR, req.custom_dataset_id)
        if not os.path.exists(custom_path):
            raise HTTPException(status_code=404, detail="Custom dataset file not found")
            
    try:
        results = train_model(
            dataset_name=req.dataset,
            classifier_name=req.classifier,
            normalization_name=req.normalization,
            custom_file_path=custom_path
        )
        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Training error: {str(e)}")


@app.post("/api/predict")
def predict_endpoint(req: PredictRequest):
    try:
        prediction = predict_defect(
            dataset_name=req.dataset,
            classifier_name=req.classifier,
            normalization_name=req.normalization,
            feature_dict=req.features
        )
        return prediction
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
