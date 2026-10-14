import React from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import {
  Award,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  HelpCircle,
  Clock,
  ArrowLeft,
  Calendar,
  Cpu,
  GraduationCap,
  Sparkles,
  RotateCcw,
  ListFilter
} from 'lucide-react';

export default function Result() {
  const location = useLocation();
  const navigate = useNavigate();

  const prediction = location.state?.prediction;

  if (!prediction) {
    return (
      <div className="page-wrapper" style={{ maxWidth: '600px', textAlign: 'center', padding: '60px 20px' }}>
        <div className="card">
          <HelpCircle size={48} color="#94a3b8" style={{ margin: '0 auto 16px auto' }} />
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '8px' }}>No Active Prediction Found</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
            Please submit student indicators through the prediction form to view an assessment report.
          </p>
          <Link to="/predict" className="btn btn-primary">
            <GraduationCap size={18} />
            <span>Go to Predict Form</span>
          </Link>
        </div>
      </div>
    );
  }

  const {
    id,
    student_name,
    predicted_mark,
    category,
    model_name,
    recommendations,
    input_summary,
    timestamp
  } = prediction;

  let categoryBadgeClass = 'badge-good';
  let categoryColor = '#2563eb';
  let categoryDesc = 'Solid academic standing with potential for honors.';

  if (category === 'Excellent') {
    categoryBadgeClass = 'badge-excellent';
    categoryColor = '#059669';
    categoryDesc = 'Outstanding performance indicative of mastery across all syllabus topics.';
  } else if (category === 'Needs Improvement') {
    categoryBadgeClass = 'badge-improvement';
    categoryColor = '#d97706';
    categoryDesc = 'Passing margin with vulnerabilities in assignments or internal evaluation.';
  } else if (category === 'At Risk') {
    categoryBadgeClass = 'badge-risk';
    categoryColor = '#dc2626';
    categoryDesc = 'Critical risk of examination failure without immediate intervention.';
  }

  return (
    <div className="page-wrapper" style={{ maxWidth: '900px' }}>
      {/* Top back navigation */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <button
          onClick={() => navigate('/predict')}
          className="btn btn-outline"
          style={{ fontSize: '0.85rem', padding: '6px 14px' }}
        >
          <ArrowLeft size={16} />
          <span>Back to Predict</span>
        </button>

        <Link
          to="/history"
          className="btn btn-outline"
          style={{ fontSize: '0.85rem', padding: '6px 14px' }}
        >
          <ListFilter size={16} />
          <span>View in History</span>
        </Link>
      </div>

      {/* Main Score Hero Card */}
      <div
        className="card"
        style={{
          padding: '36px',
          textAlign: 'center',
          marginBottom: '28px',
          position: 'relative',
          overflow: 'hidden',
          background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)',
        }}
      >
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
          <Sparkles size={18} color="var(--purple)" />
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
            Assessment for: <strong style={{ color: 'var(--text-primary)' }}>{student_name}</strong>
          </span>
        </div>

        {/* Big circular score gauge */}
        <div
          style={{
            margin: '20px auto',
            width: '180px',
            height: '180px',
            borderRadius: '50%',
            background: `conic-gradient(${categoryColor} ${predicted_mark * 3.6}deg, #e2e8f0 0deg)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
            padding: '12px',
          }}
        >
          <div
            style={{
              width: '100%',
              height: '100%',
              background: '#fff',
              borderRadius: '50%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div style={{ fontSize: '3rem', fontWeight: 800, color: categoryColor, lineHeight: 1 }}>
              {predicted_mark}
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600, marginTop: '4px' }}>
              OUT OF 100
            </div>
          </div>
        </div>

        {/* Category Pill */}
        <div style={{ marginBottom: '12px' }}>
          <span
            className={`badge ${categoryBadgeClass}`}
            style={{ fontSize: '1rem', padding: '6px 18px', borderRadius: '9999px' }}
          >
            {category}
          </span>
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', maxWidth: '520px', margin: '0 auto 20px auto' }}>
          {categoryDesc}
        </p>

        {/* Progress Bar */}
        <div style={{ maxWidth: '500px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
            <span>0%</span>
            <span>50% (Passing)</span>
            <span>70% (Good)</span>
            <span>85% (Excellent)</span>
            <span>100%</span>
          </div>
          <div style={{ width: '100%', height: '10px', background: '#e2e8f0', borderRadius: '9999px', overflow: 'hidden' }}>
            <div
              style={{
                width: `${predicted_mark}%`,
                height: '100%',
                background: `linear-gradient(90deg, var(--primary), ${categoryColor})`,
                borderRadius: '9999px',
                transition: 'width 1s ease-in-out',
              }}
            />
          </div>
        </div>

        {/* Metadata info row */}
        <div
          style={{
            marginTop: '28px',
            paddingTop: '20px',
            borderTop: '1px solid var(--border)',
            display: 'flex',
            justifyContent: 'center',
            gap: '28px',
            flexWrap: 'wrap',
            fontSize: '0.82rem',
            color: 'var(--text-secondary)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Cpu size={15} color="var(--primary)" />
            <span>Model: <strong>{model_name}</strong></span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Calendar size={15} color="var(--purple)" />
            <span>Timestamp: <strong>{timestamp}</strong></span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <CheckCircle size={15} color="#10b981" />
            <span>Status: <strong>Persisted in SQLite</strong></span>
          </div>
        </div>
      </div>

      {/* Grid: Input Summary & Recommendations */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '24px', marginBottom: '28px' }}>
        {/* Input Summary */}
        <div className="card">
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <GraduationCap size={20} color="var(--primary)" />
            <span>Academic Indicators Summary</span>
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: '#f8fafc', borderRadius: 'var(--radius-md)' }}>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>Attendance</span>
              <strong style={{ fontSize: '0.92rem' }}>{input_summary?.attendance}%</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: '#f8fafc', borderRadius: 'var(--radius-md)' }}>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>Assignment Average</span>
              <strong style={{ fontSize: '0.92rem' }}>{input_summary?.assignment_score} / 100</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: '#f8fafc', borderRadius: 'var(--radius-md)' }}>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>Internal Assessment</span>
              <strong style={{ fontSize: '0.92rem' }}>{input_summary?.internal_assessment} / 30</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: '#f8fafc', borderRadius: 'var(--radius-md)' }}>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>Daily Study Hours</span>
              <strong style={{ fontSize: '0.92rem' }}>{input_summary?.study_hours} hrs/day</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: '#f8fafc', borderRadius: 'var(--radius-md)' }}>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>Previous Examination</span>
              <strong style={{ fontSize: '0.92rem' }}>{input_summary?.previous_marks} / 100</strong>
            </div>
          </div>
        </div>

        {/* Personalized Recommendations */}
        <div className="card">
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <TrendingUp size={20} color="var(--purple)" />
            <span>Targeted Recommendations</span>
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {recommendations && recommendations.length > 0 ? (
              recommendations.map((rec, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px',
                    padding: '12px 14px',
                    backgroundColor: '#f8fafc',
                    borderRadius: 'var(--radius-md)',
                    borderLeft: '4px solid var(--primary)',
                  }}
                >
                  <CheckCircle size={18} color="var(--primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-primary)', lineHeight: 1.5 }}>
                    {rec}
                  </p>
                </div>
              ))
            ) : (
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
                Keep maintaining your current study schedule and review key syllabus questions.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Academic Disclaimer Notice */}
      <div
        style={{
          padding: '16px 20px',
          background: '#fffbeb',
          border: '1px solid #fde68a',
          borderRadius: 'var(--radius-md)',
          fontSize: '0.82rem',
          color: '#92400e',
          marginBottom: '28px',
          display: 'flex',
          gap: '12px',
          alignItems: 'center',
        }}
      >
        <AlertTriangle size={20} style={{ flexShrink: 0 }} />
        <div>
          <strong>Academic Advisory Disclaimer:</strong> Predicted final examination marks are statistical estimations
          generated by machine learning models based on historical academic trends. They are intended as an early-warning
          and guidance tool, not a guarantee of actual examination results.
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: '14px', justifyContent: 'center' }}>
        <button
          onClick={() => navigate('/predict')}
          className="btn btn-primary"
          style={{ padding: '12px 24px' }}
        >
          <RotateCcw size={18} />
          <span>Predict Another Student</span>
        </button>

        <Link
          to="/history"
          className="btn btn-secondary"
          style={{ padding: '12px 24px' }}
        >
          <ListFilter size={18} />
          <span>Browse All History Records</span>
        </Link>
      </div>
    </div>
  );
}
