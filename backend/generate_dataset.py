import os
import numpy as np
import pandas as pd

np.random.seed(42)
n_samples = 600

# Realistic distributions
attendance = np.random.normal(loc=78, scale=12, size=n_samples).clip(45, 100)
assignment_score = np.random.normal(loc=75, scale=14, size=n_samples).clip(40, 100)
internal_assessment = np.random.normal(loc=22, scale=4.5, size=n_samples).clip(8, 30)
study_hours = np.random.gamma(shape=3.5, scale=1.2, size=n_samples).clip(0.5, 12.0)
previous_marks = np.random.normal(loc=73, scale=13, size=n_samples).clip(40, 100)

# Target: final_marks (0-100)
# Academic formula weighting with realistic correlation:
# previous_marks: 32%, internal_assessment (scaled to 100): 28%, assignment_score: 20%, attendance: 10%, study_hours effect: ~10% + small noise
internal_scaled = (internal_assessment / 30.0) * 100.0
raw_score = (
    0.32 * previous_marks +
    0.28 * internal_scaled +
    0.20 * assignment_score +
    0.10 * attendance +
    1.2 * study_hours +
    np.random.normal(0, 2.5, size=n_samples)
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

data_dir = os.path.join(os.path.dirname(__file__), 'data')
os.makedirs(data_dir, exist_ok=True)
csv_path = os.path.join(data_dir, 'students.csv')
df.to_csv(csv_path, index=False)
print(f"Generated {len(df)} student records at {csv_path}")
