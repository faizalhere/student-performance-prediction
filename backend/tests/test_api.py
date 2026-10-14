import pytest
import json
import os
import sys

# Add parent directory to path so app can be imported
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app import app
from utils import init_db

@pytest.fixture
def client():
    app.config['TESTING'] = True
    with app.test_client() as client:
        with app.app_context():
            init_db()
        yield client

def test_health_endpoint(client):
    response = client.get('/api/health')
    assert response.status_code == 200
    data = json.loads(response.data)
    assert data['status'] == 'healthy'
    assert 'model_name' in data

def test_predict_endpoint_valid(client):
    payload = {
        'student_name': 'Test Student',
        'attendance': 85.0,
        'assignment_score': 78.0,
        'internal_assessment': 24.0,
        'study_hours': 3.5,
        'previous_marks': 80.0
    }
    response = client.post('/api/predict', json=payload)
    assert response.status_code == 201
    data = json.loads(response.data)
    assert 'predicted_mark' in data
    assert 0 <= data['predicted_mark'] <= 100
    assert 'category' in data
    assert data['category'] in ['Excellent', 'Good', 'Needs Improvement', 'At Risk']
    assert 'recommendations' in data
    assert len(data['recommendations']) > 0
    assert 'id' in data

def test_predict_endpoint_missing_fields(client):
    payload = {
        'student_name': 'Incomplete Student',
        'attendance': 85.0
    }
    response = client.post('/api/predict', json=payload)
    assert response.status_code == 400

def test_predict_endpoint_out_of_range(client):
    payload = {
        'student_name': 'Invalid Range Student',
        'attendance': 120.0, # invalid
        'assignment_score': 78.0,
        'internal_assessment': 45.0, # invalid (> 30)
        'study_hours': 2.5,
        'previous_marks': 70.0
    }
    response = client.post('/api/predict', json=payload)
    assert response.status_code == 422

def test_dashboard_endpoint(client):
    response = client.get('/api/dashboard')
    assert response.status_code == 200
    data = json.loads(response.data)
    assert 'total_predictions' in data
    assert 'average_mark' in data
    assert 'category_counts' in data

def test_history_and_deletion(client):
    # Predict first
    payload = {
        'student_name': 'History Test Student',
        'attendance': 90.0,
        'assignment_score': 85.0,
        'internal_assessment': 27.0,
        'study_hours': 4.0,
        'previous_marks': 88.0
    }
    res = client.post('/api/predict', json=payload)
    data = json.loads(res.data)
    record_id = data['id']

    # Fetch history
    hist_res = client.get('/api/history')
    assert hist_res.status_code == 200
    hist_data = json.loads(hist_res.data)
    assert any(r['id'] == record_id for r in hist_data)

    # Delete record
    del_res = client.delete(f'/api/history/{record_id}')
    assert del_res.status_code == 200
