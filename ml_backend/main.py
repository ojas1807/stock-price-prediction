from fastapi import FastAPI
from pydantic import BaseModel
from model import predict_price

app = FastAPI()

class StockInput(BaseModel):
    model_type: str  # "linear" or "random_forest"
    features: list   # Numerical feature values

@app.post("/predict")
def get_prediction(data: StockInput):
    """Predict stock price using ML models"""
    prediction = predict_price(data.model_type, data.features)
    
    if prediction is None:
        return {"error": "Invalid model type. Choose 'linear' or 'random_forest'."}
    
    return {"predicted_price": prediction}
