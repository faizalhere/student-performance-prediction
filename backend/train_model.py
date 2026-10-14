import os
import json
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
import joblib

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_PATH = os.path.join(BASE_DIR, 'data', 'students.csv')
MODEL_DIR = os.path.join(BASE_DIR, 'models')
METRICS_PATH = os.path.join(MODEL_DIR, 'metrics.json')

FEATURE_COLUMNS = [
    'attendance',
    'assignment_score',
    'internal_assessment',
    'study_hours',
    'previous_marks'
]
TARGET_COLUMN = 'final_marks'

def ensure_dataset():
    os.makedirs(os.path.join(BASE_DIR, 'data'), exist_ok=True)
    if not os.path.exists(DATA_PATH) or os.path.getsize(DATA_PATH) < 1000:
        print("Generating comprehensive realistic student dataset (600 rows)...")
        np.random.seed(42)
        n_samples = 600
        attendance = np.random.normal(loc=78, scale=11, size=n_samples).clip(45, 100)
        assignment_score = np.random.normal(loc=76, scale=13, size=n_samples).clip(40, 100)
        internal_assessment = np.random.normal(loc=22, scale=4.2, size=n_samples).clip(8, 30)
        study_hours = np.random.gamma(shape=3.5, scale=1.1, size=n_samples).clip(0.5, 12.0)
        previous_marks = np.random.normal(loc=74, scale=12, size=n_samples).clip(40, 100)

        internal_scaled = (internal_assessment / 30.0) * 100.0
        raw_score = (
            0.32 * previous_marks +
            0.28 * internal_scaled +
            0.20 * assignment_score +
            0.10 * attendance +
            1.2 * study_hours +
            np.random.normal(0, 2.2, size=n_samples)
        )
        final_marks = np.clip(np.round(raw_score, 1), 25.0, 100.0)

        df = pd.DataFrame({
            'attendance': np.round(attendance, 1),
            'assignment_score': np.round(assignment_score, 1),
            'internal_assessment': np.round(internal_assessment, 1),
            'study_hours': np.round(study_hours, 1),
            'previous_marks': np.round(previous_marks, 1),
            'final_marks': final_marks
        })
        df.to_csv(DATA_PATH, index=False)
        print(f"Dataset successfully created with {len(df)} records at {DATA_PATH}")

def load_and_clean_data():
    ensure_dataset()
    df = pd.read_csv(DATA_PATH)
    cols = FEATURE_COLUMNS + [TARGET_COLUMN]
    for c in cols:
        df[c] = pd.to_numeric(df[c], errors='coerce')
    df = df.dropna()

    # Range validation
    df = df[
        (df['attendance'] >= 0) & (df['attendance'] <= 100) &
        (df['assignment_score'] >= 0) & (df['assignment_score'] <= 100) &
        (df['internal_assessment'] >= 0) & (df['internal_assessment'] <= 30) &
        (df['study_hours'] >= 0) & (df['study_hours'] <= 24) &
        (df['previous_marks'] >= 0) & (df['previous_marks'] <= 100) &
        (df['final_marks'] >= 0) & (df['final_marks'] <= 100)
    ]
    return df

def train_and_evaluate():
    df = load_and_clean_data()
    X = df[FEATURE_COLUMNS]
    y = df[TARGET_COLUMN]

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.20, random_state=42
    )

    models = {
        'Linear Regression': LinearRegression(),
        'Random Forest Regressor': RandomForestRegressor(n_estimators=100, max_depth=8, random_state=42)
    }

    evaluations = {}
    predictions_map = {}

    for name, model in models.items():
        model.fit(X_train, y_train)
        y_pred = model.predict(X_test)
        predictions_map[name] = y_pred

        mae = float(mean_absolute_error(y_test, y_pred))
        rmse = float(np.sqrt(mean_squared_error(y_test, y_pred)))
        r2 = float(r2_score(y_test, y_pred))

        evaluations[name] = {
            'MAE': round(mae, 3),
            'RMSE': round(rmse, 3),
            'R2': round(r2, 4)
        }

    # Best model selection by lowest test-set MAE
    best_model_name = min(evaluations, key=lambda k: evaluations[k]['MAE'])
    best_model = models[best_model_name]

    # Feature importances
    rf_model = models['RandomForestRegressor' if 'RandomForestRegressor' in models else 'Random Forest Regressor']
    feature_importances = []
    for col, imp in zip(FEATURE_COLUMNS, rf_model.feature_importances_):
        feature_importances.append({
            'feature': col.replace('_', ' ').title(),
            'importance': round(float(imp) * 100, 2)
        })
    feature_importances = sorted(feature_importances, key=lambda x: x['importance'], reverse=True)

    # Comparison points for visualization (sample 25 test points)
    comparison_points = []
    sample_indices = np.linspace(0, len(y_test) - 1, num=min(25, len(y_test)), dtype=int)
    y_test_arr = y_test.values
    best_preds_arr = predictions_map[best_model_name]

    for idx, sample_idx in enumerate(sample_indices):
        comparison_points.append({
            'id': idx + 1,
            'actual': round(float(y_test_arr[sample_idx]), 1),
            'predicted': round(float(best_preds_arr[sample_idx]), 1)
        })

    os.makedirs(MODEL_DIR, exist_ok=True)

    # Save models
    for name, model in models.items():
        clean_key = name.replace(' ', '')
        joblib.dump(model, os.path.join(MODEL_DIR, f"{clean_key}.joblib"))

    # Also save designated best_model.joblib
    joblib.dump(best_model, os.path.join(MODEL_DIR, "best_model.joblib"))

    metrics_payload = {
        'best_model': best_model_name,
        'best_model_key': best_model_name.replace(' ', ''),
        'evaluations': evaluations,
        'feature_importances': feature_importances,
        'comparison_points': comparison_points,
        'dataset_summary': {
            'total_samples': len(df),
            'train_samples': len(X_train),
            'test_samples': len(X_test),
            'features': FEATURE_COLUMNS
        }
    }

    with open(METRICS_PATH, 'w') as f:
        json.dump(metrics_payload, f, indent=2)

    print("=== Model Training & Evaluation Complete ===")
    print(f"Selected Best Model: {best_model_name}")
    print(json.dumps(evaluations, indent=2))
    return metrics_payload

if __name__ == '__main__':
    train_and_evaluate()
