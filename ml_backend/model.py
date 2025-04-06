import pickle
import os
import numpy as np

# Debug: Check if model files exist
model_files = ["models/lr_model.pkl", "models/rf_model.pkl", "models/scaler.pkl"]
for file in model_files:
    print(f"Checking {file}: Exists? {os.path.exists(file)}")

# Load models and scaler
try:
    with open("models/lr_model.pkl", "rb") as f:
        lr_model = pickle.load(f)

    with open("models/rf_model.pkl", "rb") as f:
        rf_model = pickle.load(f)

    with open("models/scaler.pkl", "rb") as f:
        scaler = pickle.load(f)

    print("✅ Models loaded successfully!")

except EOFError:
    print("❌ ERROR: Model files are corrupted! Re-run train_model.py.")

# ✅ Add predict_price function
def predict_price(model_type: str, features: list):
    """Predict stock price based on input features"""
    features = np.array(features).reshape(1, -1)
    features_scaled = scaler.transform(features)

    if model_type == "linear":
        return lr_model.predict(features_scaled)[0]
    elif model_type == "random_forest":
        return rf_model.predict(features_scaled)[0]
    else:
        return None  # Invalid model type
