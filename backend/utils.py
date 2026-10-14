import sqlite3
import os
import json
from datetime import datetime

DB_PATH = os.path.join(os.path.dirname(__file__), 'predictions.db')

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS predictions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            student_name TEXT,
            attendance REAL NOT NULL,
            assignment_score REAL NOT NULL,
            internal_assessment REAL NOT NULL,
            study_hours REAL NOT NULL,
            previous_marks REAL NOT NULL,
            predicted_mark REAL NOT NULL,
            category TEXT NOT NULL,
            model_name TEXT NOT NULL,
            recommendations TEXT NOT NULL,
            timestamp TEXT NOT NULL
        )
    ''')
    conn.commit()
    conn.close()

def categorize(marks):
    if marks >= 85.0:
        return 'Excellent'
    elif marks >= 70.0:
        return 'Good'
    elif marks >= 50.0:
        return 'Needs Improvement'
    else:
        return 'At Risk'

def generate_recommendations(data, predicted_mark):
    recs = []
    att = float(data.get('attendance', 0))
    assign = float(data.get('assignment_score', 0))
    internal = float(data.get('internal_assessment', 0))
    hours = float(data.get('study_hours', 0))
    prev = float(data.get('previous_marks', 0))

    if att < 75.0:
        recs.append("Attendance is below 75%. Prioritize regular lecture attendance to avoid eligibility issues and bridge conceptual gaps.")
    elif att >= 90.0:
        recs.append("Great attendance discipline! Keep maintaining this consistency.")

    if hours < 3.0:
        recs.append("Daily self-study is less than 3 hours. Dedicate at least 3-4 focused hours daily with active recall.")
    elif hours >= 6.0:
        recs.append("Strong daily study investment. Ensure balanced breaks using Pomodoro to avoid burnout.")

    if assign < 65.0:
        recs.append("Assignment scores need improvement. Review tutor feedback and complete practice problem sets early.")
    
    if internal < 18.0:
        recs.append("Internal assessment marks (out of 30) are relatively low. Prepare rigorously for midterms and lab submissions.")

    if prev < 60.0:
        recs.append("Revisit prerequisite fundamentals from previous terms to build confidence in advanced topics.")

    if predicted_mark >= 85.0:
        recs.append("High projected performance! Aim for top university rank and explore academic research or capstone projects.")
    elif predicted_mark < 50.0:
        recs.append("Critical support needed. Schedule an academic counseling session and join structured peer study groups immediately.")

    if not recs:
        recs.append("Maintain steady study habits, participate actively in seminars, and attempt mock final examination papers.")

    return recs
