import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  GraduationCap,
  RotateCcw,
  Sparkles,
  AlertCircle,
  HelpCircle,
  Clock,
  BookOpen,
  Award,
  CheckCircle2,
  CalendarCheck,
  Zap
} from 'lucide-react';
import api from '../services/api';

export default function Predict() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    student_name: 'Demo Student',
    attendance: '85',
    assignment_score: '78',
    internal_assessment: '24',
    study_hours: '2.5',
    previous_marks: '72',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(null);

  const applyPreset = (preset) => {
    if (preset === 'demo') {
      setFormData({
        student_name: 'Demo Student',
        attendance: '85',
        assignment_score: '78',
        internal_assessment: '24',
        study_hours: '2.5',
        previous_marks: '72',
      });
    } else if (preset === 'high') {
      setFormData({
        student_name: 'Sophia Patel',
        attendance: '95',
        assignment_score: '92',
        internal_assessment: '28.5',
        study_hours: '6.0',
        previous_marks: '91',
      });
    } else if (preset === 'atrisk') {
      setFormData({
        student_name: 'Alex Johnson',
        attendance: '55',
        assignment_score: '48',
        internal_assessment: '13',
        study_hours: '1.2',
        previous_marks: '46',
      });
    }
    setErrors({});
    setApiError(null);
  };

  const validate = () => {
    const errs = {};
    const att = parseFloat(formData.attendance);
    if (isNaN(att) || att < 0 || att > 100) {
      errs.attendance = 'Attendance must be between 0% and 100%';
    }

    const assign = parseFloat(formData.assignment_score);
    if (isNaN(assign) || assign < 0 || assign > 100) {
      errs.assignment_score = 'Assignment score must be between 0 and 100';
    }

    const internal = parseFloat(formData.internal_assessment);
    if (isNaN(internal) || internal < 0 || internal > 30) {
      errs.internal_assessment = 'Internal assessment marks must be between 0 and 30';
    }

    const hours = parseFloat(formData.study_hours);
    if (isNaN(hours) || hours < 0 || hours > 24) {
      errs.study_hours = 'Daily study hours must be between 0 and 24 hours';
    }

    const prev = parseFloat(formData.previous_marks);
    if (isNaN(prev) || prev < 0 || prev > 100) {
      errs.previous_marks = 'Previous marks must be between 0 and 100';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setApiError(null);

    try {
      const payload = {
        student_name: formData.student_name.trim() || 'Anonymous Student',
        attendance: parseFloat(formData.attendance),
        assignment_score: parseFloat(formData.assignment_score),
        internal_assessment: parseFloat(formData.internal_assessment),
        study_hours: parseFloat(formData.study_hours),
        previous_marks: parseFloat(formData.previous_marks),
      };

      const result = await api.predict(payload);
      // Navigate to result display with returned data
      navigate(`/result/${result.id}`, { state: { prediction: result } });
    } catch (err) {
      setApiError(err.message || 'Failed to submit prediction request to Flask backend.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      student_name: '',
      attendance: '',
      assignment_score: '',
      internal_assessment: '',
      study_hours: '',
      previous_marks: '',
    });
    setErrors({});
    setApiError(null);
  };

  return (
    <div className="page-wrapper" style={{ maxWidth: '900px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '8px' }}>
          Predict Academic Performance
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          Provide the student's academic indicators to generate an ML-estimated final examination mark with targeted guidance.
        </p>
      </div>

      {/* Preset Quick Fill Bar */}
      <div
        className="card"
        style={{
          padding: '16px 20px',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          background: '#f8fafc',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.88rem', fontWeight: 600 }}>
          <Zap size={18} color="var(--primary)" />
          <span>Quick Preset Fill:</span>
        </div>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button
            type="button"
            className="btn btn-outline"
            style={{ fontSize: '0.8rem', padding: '6px 12px' }}
            onClick={() => applyPreset('demo')}
          >
            Demo Student (85% Att, 78 Asg)
          </button>
          <button
            type="button"
            className="btn btn-outline"
            style={{ fontSize: '0.8rem', padding: '6px 12px' }}
            onClick={() => applyPreset('high')}
          >
            High Performer (95% Att)
          </button>
          <button
            type="button"
            className="btn btn-outline"
            style={{ fontSize: '0.8rem', padding: '6px 12px' }}
            onClick={() => applyPreset('atrisk')}
          >
            At-Risk Student (55% Att)
          </button>
        </div>
      </div>

      {apiError && (
        <div
          style={{
            padding: '16px 20px',
            backgroundColor: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: 'var(--radius-md)',
            color: '#991b1b',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <AlertCircle size={20} />
          <div>{apiError}</div>
        </div>
      )}

      {/* Input Form Card */}
      <form onSubmit={handleSubmit} className="card">
        {/* Student Name */}
        <div className="form-group">
          <label className="form-label" htmlFor="student_name">
            Student Full Name or ID (Optional)
          </label>
          <div className="form-description">
            Used to identify records in persistent history and assessment reports.
          </div>
          <input
            id="student_name"
            name="student_name"
            type="text"
            className="form-input"
            placeholder="e.g. Demo Student / CS-2024-042"
            value={formData.student_name}
            onChange={handleChange}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
          {/* Attendance */}
          <div className="form-group">
            <label className="form-label" htmlFor="attendance">
              Attendance Percentage (0 - 100%)
            </label>
            <div className="form-description">Official class attendance percentage for this semester.</div>
            <input
              id="attendance"
              name="attendance"
              type="number"
              step="0.1"
              min="0"
              max="100"
              className="form-input"
              placeholder="e.g. 85"
              value={formData.attendance}
              onChange={handleChange}
              required
            />
            {errors.attendance && <div style={{ color: '#dc2626', fontSize: '0.8rem', marginTop: '4px' }}>{errors.attendance}</div>}
          </div>

          {/* Assignment Average */}
          <div className="form-group">
            <label className="form-label" htmlFor="assignment_score">
              Assignment Average Score (0 - 100)
            </label>
            <div className="form-description">Average score across homework, lab reports, and mini-assignments.</div>
            <input
              id="assignment_score"
              name="assignment_score"
              type="number"
              step="0.1"
              min="0"
              max="100"
              className="form-input"
              placeholder="e.g. 78"
              value={formData.assignment_score}
              onChange={handleChange}
              required
            />
            {errors.assignment_score && <div style={{ color: '#dc2626', fontSize: '0.8rem', marginTop: '4px' }}>{errors.assignment_score}</div>}
          </div>

          {/* Internal Assessment Marks */}
          <div className="form-group">
            <label className="form-label" htmlFor="internal_assessment">
              Internal Assessment Marks (0 - 30)
            </label>
            <div className="form-description">Midterm examinations and faculty assessment score (max 30 marks).</div>
            <input
              id="internal_assessment"
              name="internal_assessment"
              type="number"
              step="0.1"
              min="0"
              max="30"
              className="form-input"
              placeholder="e.g. 24"
              value={formData.internal_assessment}
              onChange={handleChange}
              required
            />
            {errors.internal_assessment && <div style={{ color: '#dc2626', fontSize: '0.8rem', marginTop: '4px' }}>{errors.internal_assessment}</div>}
          </div>

          {/* Daily Study Hours */}
          <div className="form-group">
            <label className="form-label" htmlFor="study_hours">
              Daily Study Hours (0 - 24 hrs)
            </label>
            <div className="form-description">Average dedicated daily self-study hours outside class.</div>
            <input
              id="study_hours"
              name="study_hours"
              type="number"
              step="0.1"
              min="0"
              max="24"
              className="form-input"
              placeholder="e.g. 2.5"
              value={formData.study_hours}
              onChange={handleChange}
              required
            />
            {errors.study_hours && <div style={{ color: '#dc2626', fontSize: '0.8rem', marginTop: '4px' }}>{errors.study_hours}</div>}
          </div>

          {/* Previous Examination Marks */}
          <div className="form-group" style={{ gridColumn: '1 / -1' }}>
            <label className="form-label" htmlFor="previous_marks">
              Previous Semester / Prerequisite Marks (0 - 100)
            </label>
            <div className="form-description">Historical examination score from prior relevant terms or courses.</div>
            <input
              id="previous_marks"
              name="previous_marks"
              type="number"
              step="0.1"
              min="0"
              max="100"
              className="form-input"
              placeholder="e.g. 72"
              value={formData.previous_marks}
              onChange={handleChange}
              required
            />
            {errors.previous_marks && <div style={{ color: '#dc2626', fontSize: '0.8rem', marginTop: '4px' }}>{errors.previous_marks}</div>}
          </div>
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: '14px', marginTop: '20px', paddingTop: '20px', borderTop: '1px solid var(--border)' }}>
          <button
            type="submit"
            className="btn btn-primary"
            style={{ flex: 2, padding: '12px 24px', fontSize: '1rem' }}
            disabled={loading}
          >
            {loading ? (
              <span>Calculating Model Prediction...</span>
            ) : (
              <>
                <Sparkles size={18} />
                <span>Predict Performance</span>
              </>
            )}
          </button>

          <button
            type="button"
            className="btn btn-outline"
            style={{ flex: 1 }}
            onClick={handleReset}
            disabled={loading}
          >
            <RotateCcw size={16} />
            <span>Reset</span>
          </button>
        </div>
      </form>
    </div>
  );
}
