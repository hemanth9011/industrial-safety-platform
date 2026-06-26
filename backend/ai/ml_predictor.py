"""Machine Learning - Risk Prediction Model"""
import numpy as np
import pickle
from typing import Tuple, Dict
from pathlib import Path
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler

class RiskPredictionModel:
    def __init__(self, model_path: str = None):
        """Initialize prediction model"""
        self.model_path = model_path or "models/risk_predictor.pkl"
        self.model = None
        self.scaler = None
        self.feature_names = [
            "temperature", "gas_concentration", "pressure", "smoke",
            "helmet_detection", "worker_density", "vibration", "humidity"
        ]
        self.initialize_model()

    def initialize_model(self):
        """Initialize or load the model"""
        try:
            # Try to load existing model
            if Path(self.model_path).exists():
                with open(self.model_path, 'rb') as f:
                    self.model = pickle.load(f)
        except:
            # Create a new model if loading fails
            self.model = RandomForestClassifier(n_estimators=100, random_state=42)
            self.train_demo_model()

    def train_demo_model(self):
        """Train model on simulated historical data"""
        # Generate synthetic training data
        np.random.seed(42)
        n_samples = 1000
        
        X = np.random.randn(n_samples, len(self.feature_names))
        # Normalize features to realistic ranges
        X[:, 0] = X[:, 0] * 5 + 22  # temperature
        X[:, 1] = np.abs(X[:, 1]) * 25 + 30  # gas
        X[:, 2] = X[:, 2] * 0.05 + 1.0  # pressure
        X[:, 3] = np.abs(X[:, 3]) * 100 + 200  # smoke
        X[:, 4] = np.abs(X[:, 4]) * 0.2 + 0.8  # helmet detection
        X[:, 5] = np.abs(X[:, 5]) * 15 + 30  # worker density
        X[:, 6] = np.abs(X[:, 6]) * 10  # vibration
        X[:, 7] = np.abs(X[:, 7]) * 20 + 50  # humidity
        
        # Create synthetic labels based on features
        y = np.zeros(n_samples, dtype=int)
        for i in range(n_samples):
            risk_score = 0
            if X[i, 0] > 30 or X[i, 0] < 15:  # temp
                risk_score += 1
            if X[i, 1] > 70:  # gas
                risk_score += 1
            if X[i, 3] > 300:  # smoke
                risk_score += 1
            if X[i, 4] < 0.7:  # helmet
                risk_score += 1
            y[i] = 2 if risk_score >= 2 else (1 if risk_score == 1 else 0)  # critical, warning, safe
        
        # Train model
        self.model.fit(X, y)
        self.scaler = StandardScaler()
        self.scaler.fit(X)

    def predict(self, features: Dict[str, float]) -> Tuple[str, float, float]:
        """
        Predict risk level.
        Returns: (risk_level, confidence, risk_score)
        """
        # Prepare feature vector
        feature_vector = np.array([
            features.get(name, 0) for name in self.feature_names
        ]).reshape(1, -1)
        
        # Scale features
        if self.scaler:
            feature_vector = self.scaler.transform(feature_vector)
        
        # Make prediction
        prediction = self.model.predict(feature_vector)[0]
        probabilities = self.model.predict_proba(feature_vector)[0]
        confidence = float(np.max(probabilities))
        
        # Map prediction to risk level
        risk_levels = {0: "safe", 1: "warning", 2: "critical"}
        risk_level = risk_levels.get(prediction, "unknown")
        
        # Calculate risk score (0-100)
        risk_score = sum(probabilities[i] * (i * 50) for i in range(len(probabilities)))
        
        return risk_level, confidence, float(risk_score)

# Global prediction model instance
predictor = RiskPredictionModel()
