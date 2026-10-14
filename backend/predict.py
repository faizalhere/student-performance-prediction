import os
import joblib
import numpy as np
import pandas as pd
import json

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_DIR = os.path.join(BASE_DIR, 'models')
METRICS_PATH = os.path.join(MODEL_DIR, 'metrics.json')

FEATURE_COLUMNS = [
    'attendance',
    'assignment_score',
    'internal_assessment',
    'study_hours',
    'previous_marks'
]

class PerformancePredictor:
    def __init__(self):
        self.model = None
        self.model_name = "Unknown"
        self.load_model()

    def load_model(self):
        best_model_path = os.path.join(MODEL_DIR, 'best_model.joblib')
        if os.path.exists(best_model_path):
            self.model = joblib.load(best_model_path)
            if os.path.exists(METRICS_PATH):
                with open(METRICS_PATH, 'r') as f:
                    meta = json.load(f)
                    self.model_name = meta.get('best_model', 'Linear Regression')
            else:
                self.model_name = "Linear Regression"
        else:
            self.model = None
            self.model_name = None

    def predict(self, attendance, assignment_score, internal_assessment, study_hours, previous_marks):
        if self.model is None:
            self.load_model()
            if self.model is None:
                raise RuntimeError("Model is not trained or loaded yet. Run train_model.py first.")

        # Features with column names to prevent sklearn warnings
        features = pd.DataFrame([[
            float(attendance),
            float(assignment_score),
            float(internal_assessment),
            float(study_hours),
            float(previous_marks)
        ]], columns=FEATURE_COLUMNS)

        raw_pred = float(self.model.predict(features)[0])
        # Clip to realistic exam bounds 0 - 100
        predicted_mark = round(float(np.clip(raw_pred, 0.0, 100.0)), 2)
        return predicted_mark, self.model_name

predictor = PerformancePredictor()
