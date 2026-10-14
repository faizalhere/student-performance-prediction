import os
import json
from datetime import datetime, timezone
from flask import Flask, request, jsonify
from flask_cors import CORS
from utils import get_db, init_db, categorize, generate_recommendations
from predict import predictor

app = Flask(__name__)
# Enable CORS for frontend development
CORS(app, resources={r"/api/*": {"origins": "*"}})

# Ensure database tables are created at startup
with app.app_context():
    init_db()

@app.route('/api/health', methods=['GET'])
def health():
    is_loaded = predictor.model is not None
    return jsonify({
        'status': 'healthy',
        'model_loaded': is_loaded,
        'model_name': predictor.model_name or 'Not Loaded',
        'timestamp': datetime.now(timezone.utc).isoformat()
    }), 200

@app.route('/api/predict', methods=['POST'])
def predict():
    data = request.get_json() or {}
    
    # Required fields validation
    fields = ['attendance', 'assignment_score', 'internal_assessment', 'study_hours', 'previous_marks']
    missing = [f for f in fields if f not in data or data[f] is None or data[f] == '']
    if missing:
        return jsonify({
            'error': f'Missing required fields: {", ".join(missing)}'
        }), 400

    try:
        attendance = float(data['attendance'])
        assignment_score = float(data['assignment_score'])
        internal_assessment = float(data['internal_assessment'])
        study_hours = float(data['study_hours'])
        previous_marks = float(data['previous_marks'])
    except (ValueError, TypeError):
        return jsonify({'error': 'All academic inputs must be valid numeric values.'}), 400

    # Range validation
    errors = []
    if not (0 <= attendance <= 100):
        errors.append('Attendance percentage must be between 0 and 100.')
    if not (0 <= assignment_score <= 100):
        errors.append('Assignment average must be between 0 and 100.')
    if not (0 <= internal_assessment <= 30):
        errors.append('Internal assessment marks must be between 0 and 30.')
    if not (0 <= study_hours <= 24):
        errors.append('Daily study hours must be between 0 and 24.')
    if not (0 <= previous_marks <= 100):
        errors.append('Previous examination marks must be between 0 and 100.')

    if errors:
        return jsonify({'error': 'Validation Error', 'details': errors}), 422

    student_name = str(data.get('student_name', '')).strip() or 'Anonymous Student'

    try:
        predicted_mark, model_used = predictor.predict(
            attendance=attendance,
            assignment_score=assignment_score,
            internal_assessment=internal_assessment,
            study_hours=study_hours,
            previous_marks=previous_marks
        )
    except Exception as e:
        return jsonify({'error': f'Prediction execution failed: {str(e)}'}), 500

    category = categorize(predicted_mark)
    recommendations = generate_recommendations(data, predicted_mark)
    timestamp = datetime.now(timezone.utc).strftime('%Y-%m-%d %H:%M:%S')

    # Persist in SQLite
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('''
        INSERT INTO predictions (
            student_name, attendance, assignment_score, internal_assessment,
            study_hours, previous_marks, predicted_mark, category,
            model_name, recommendations, timestamp
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', (
        student_name,
        attendance,
        assignment_score,
        internal_assessment,
        study_hours,
        previous_marks,
        predicted_mark,
        category,
        model_used,
        json.dumps(recommendations),
        timestamp
    ))
    record_id = cursor.lastrowid
    conn.commit()
    conn.close()

    return jsonify({
        'id': record_id,
        'student_name': student_name,
        'predicted_mark': predicted_mark,
        'category': category,
        'model_name': model_used,
        'recommendations': recommendations,
        'input_summary': {
            'attendance': attendance,
            'assignment_score': assignment_score,
            'internal_assessment': internal_assessment,
            'study_hours': study_hours,
            'previous_marks': previous_marks
        },
        'timestamp': timestamp,
        'message': 'Prediction calculated and saved successfully.'
    }), 201

@app.route('/api/metrics', methods=['GET'])
def get_metrics():
    metrics_path = os.path.join(os.path.dirname(__file__), 'models', 'metrics.json')
    if not os.path.exists(metrics_path):
        return jsonify({
            'error': 'Model evaluation metrics not found. Please train models first.'
        }), 404

    with open(metrics_path, 'r') as f:
        metrics_data = json.load(f)
    return jsonify(metrics_data), 200

@app.route('/api/history', methods=['GET'])
def get_history():
    search = request.args.get('search', '').strip().lower()
    sort_by = request.args.get('sort', 'latest')

    conn = get_db()
    cursor = conn.cursor()

    query = 'SELECT * FROM predictions'
    params = []

    if search:
        query += ' WHERE LOWER(student_name) LIKE ? OR LOWER(category) LIKE ?'
        params.extend([f'%{search}%', f'%{search}%'])

    if sort_by == 'oldest':
        query += ' ORDER BY id ASC'
    elif sort_by == 'marks_high':
        query += ' ORDER BY predicted_mark DESC'
    elif sort_by == 'marks_low':
        query += ' ORDER BY predicted_mark ASC'
    else:
        query += ' ORDER BY id DESC'

    cursor.execute(query, params)
    rows = cursor.fetchall()
    conn.close()

    history = []
    for row in rows:
        recs = []
        try:
            recs = json.loads(row['recommendations'])
        except Exception:
            recs = [row['recommendations']]

        history.append({
            'id': row['id'],
            'student_name': row['student_name'],
            'attendance': row['attendance'],
            'assignment_score': row['assignment_score'],
            'internal_assessment': row['internal_assessment'],
            'study_hours': row['study_hours'],
            'previous_marks': row['previous_marks'],
            'predicted_mark': row['predicted_mark'],
            'category': row['category'],
            'model_name': row['model_name'],
            'recommendations': recs,
            'timestamp': row['timestamp']
        })

    return jsonify(history), 200

@app.route('/api/history/<int:prediction_id>', methods=['DELETE'])
def delete_history(prediction_id):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('DELETE FROM predictions WHERE id = ?', (prediction_id,))
    deleted = cursor.rowcount > 0
    conn.commit()
    conn.close()

    if deleted:
        return jsonify({'success': True, 'message': f'Record #{prediction_id} deleted.'}), 200
    return jsonify({'error': 'Prediction record not found.'}), 404

@app.route('/api/dashboard', methods=['GET'])
def get_dashboard():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM predictions ORDER BY id DESC')
    rows = cursor.fetchall()
    conn.close()

    if not rows:
        return jsonify({
            'total_predictions': 0,
            'average_mark': 0.0,
            'highest_mark': 0.0,
            'lowest_mark': 0.0,
            'category_counts': {
                'Excellent': 0,
                'Good': 0,
                'Needs Improvement': 0,
                'At Risk': 0
            },
            'recent_activity': [],
            'has_data': False
        }), 200

    marks = [float(r['predicted_mark']) for r in rows]
    category_counts = {
        'Excellent': 0,
        'Good': 0,
        'Needs Improvement': 0,
        'At Risk': 0
    }
    for r in rows:
        cat = r['category']
        if cat in category_counts:
            category_counts[cat] += 1

    recent = []
    for r in rows[:6]:
        recent.append({
            'id': r['id'],
            'student_name': r['student_name'],
            'predicted_mark': r['predicted_mark'],
            'category': r['category'],
            'attendance': r['attendance'],
            'timestamp': r['timestamp']
        })

    return jsonify({
        'total_predictions': len(rows),
        'average_mark': round(sum(marks) / len(marks), 1),
        'highest_mark': round(max(marks), 1),
        'lowest_mark': round(min(marks), 1),
        'category_counts': category_counts,
        'recent_activity': recent,
        'has_data': True
    }), 200

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=5000, debug=False)
