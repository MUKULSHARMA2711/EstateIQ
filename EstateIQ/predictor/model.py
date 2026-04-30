import joblib
import os
from pathlib import Path

# Get the path to the model file in MLModel directory
BASE_DIR = Path(__file__).resolve().parent.parent.parent  # Go up to EstateIQ (outer)
model_path = os.path.join(BASE_DIR, "MLModel", "random_forest_model.pkl")

try:
    model = joblib.load(model_path)
    print(f"✓ Model loaded successfully from: {model_path}")
except Exception as e:
    print(f"✗ Error loading model from {model_path}: {e}")
    model = None

def predict_price(data):
    """
    Predict house price based on features
    
    Args:
        data: list of features [bedrooms, bathrooms, sqft_living, grade, 
              condition, yr_built, lat, long]
    
    Returns:
        predicted price
    """
    if model is None:
        raise Exception("ML model not loaded. Ensure random_forest_model.pkl exists in workspace root.")
    
    prediction = model.predict([data])
    return float(prediction[0])
