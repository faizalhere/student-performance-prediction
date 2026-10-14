import React from 'react';
import {
  Info,
  CheckCircle2,
  Cpu,
  Database,
  Globe,
  Layers,
  ArrowRight,
  ShieldAlert,
  Sparkles,
  BookOpen,
  Code2
} from 'lucide-react';

export default function About() {
  const steps = [
    {
      num: '01',
      title: 'Data Collection & Verification',
      desc: 'Synthetic academic dataset modeled on realistic Indian/global university curriculum scores (600 student profiles).',
    },
    {
      num: '02',
      title: 'Preprocessing & Validation',
      desc: 'Range checks, missing value removal, and 80:20 train-test split avoiding data leakage.',
    },
    {
      num: '03',
      title: 'Multi-Model Regression Training',
      desc: 'Training Linear Regression (parametric baseline) and Random Forest Regressor (ensemble non-linear).',
    },
    {
      num: '04',
      title: 'Metric-Driven Champion Selection',
      desc: 'Automated champion selection picking the model with lowest held-out Test MAE.',
    },
    {
      num: '05',
      title: 'Flask REST API & SQLite Sync',
      desc: 'Exposing POST /api/predict, GET /api/metrics, and persistent SQLite prediction history.',
    },
    {
      num: '06',
      title: 'Modern React Analytics Dashboard',
      desc: 'Interactive UI with Recharts visual graphs, responsive navigation, and actionable student recommendations.',
    },
  ];

  return (
    <div className="page-wrapper" style={{ maxWidth: '1000px' }}>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '8px' }}>
          About the Project
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          Comprehensive documentation of objectives, machine learning workflow, technology stack, and architectural decisions.
        </p>
      </div>

      {/* Overview Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px', marginBottom: '32px' }}>
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
            <BookOpen size={22} color="var(--primary)" />
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Problem Statement</h3>
          </div>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            In traditional university settings, students at academic risk are often identified only after end-semester
            examination results are released—when it is too late to offer remedial guidance. Academic advisors lack
            data-driven foresight into how attendance, midterms, assignment scores, and daily study hours combine to impact final outcomes.
          </p>
        </div>

        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
            <Sparkles size={22} color="var(--purple)" />
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Proposed Solution</h3>
          </div>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            The <strong>Student Performance Prediction System</strong> is an end-to-end full-stack machine learning application
            that predicts expected final examination marks with quantified confidence. It classifies students into actionable
            performance categories (Excellent, Good, Needs Improvement, At Risk) and automatically provides personalized recommendations.
          </p>
        </div>
      </div>

      {/* Machine Learning Pipeline Workflow */}
      <div className="card" style={{ marginBottom: '32px' }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '6px' }}>
          End-to-End Machine Learning Pipeline
        </h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '24px' }}>
          How academic data travels from raw inputs to predictive assessment.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
          {steps.map((st) => (
            <div
              key={st.num}
              style={{
                padding: '18px',
                background: '#f8fafc',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border)',
                position: 'relative',
              }}
            >
              <div
                style={{
                  fontSize: '0.8rem',
                  fontWeight: 800,
                  color: 'var(--primary)',
                  marginBottom: '6px',
                  letterSpacing: '0.05em',
                }}
              >
                STEP {st.num}
              </div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '6px' }}>{st.title}</h4>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{st.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Technology Stack Grid */}
      <div className="card" style={{ marginBottom: '32px' }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '20px' }}>Technology Stack</h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
          <div style={{ padding: '16px', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)' }}>
            <Globe size={24} color="var(--primary)" style={{ marginBottom: '10px' }} />
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '6px' }}>Frontend Layer</h4>
            <ul style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', listStyleType: 'none', lineHeight: 1.8 }}>
              <li>• React.js 18 (Vite)</li>
              <li>• Recharts Data Viz</li>
              <li>• Lucide React Icons</li>
              <li>• Modern SaaS CSS Design</li>
            </ul>
          </div>

          <div style={{ padding: '16px', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)' }}>
            <Code2 size={24} color="var(--purple)" style={{ marginBottom: '10px' }} />
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '6px' }}>Backend API</h4>
            <ul style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', listStyleType: 'none', lineHeight: 1.8 }}>
              <li>• Python 3.13 / Flask</li>
              <li>• Flask-CORS</li>
              <li>• RESTful Endpoints</li>
              <li>• Input Sanitization & Testing</li>
            </ul>
          </div>

          <div style={{ padding: '16px', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)' }}>
            <Cpu size={24} color="#059669" style={{ marginBottom: '10px' }} />
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '6px' }}>Machine Learning</h4>
            <ul style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', listStyleType: 'none', lineHeight: 1.8 }}>
              <li>• Scikit-learn</li>
              <li>• Random Forest Regressor</li>
              <li>• Linear Regression</li>
              <li>• Joblib Serialization</li>
            </ul>
          </div>

          <div style={{ padding: '16px', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)' }}>
            <Database size={24} color="#d97706" style={{ marginBottom: '10px' }} />
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '6px' }}>Database & Storage</h4>
            <ul style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', listStyleType: 'none', lineHeight: 1.8 }}>
              <li>• SQLite Embedded DB</li>
              <li>• Persistent Predictions</li>
              <li>• CSV Synthetic Dataset</li>
              <li>• JSON Metrics Cache</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Advantages, Limitations & Future Scope */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#059669', marginBottom: '10px', fontWeight: 700 }}>
            <CheckCircle2 size={18} />
            <h4>Key Advantages</h4>
          </div>
          <ul style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', paddingLeft: '18px', lineHeight: 1.6 }}>
            <li>Zero cold-start delay: trained regression models respond within milliseconds.</li>
            <li>Early warning identification prevents dropout and course repeats.</li>
            <li>Targeted advice points to exact weaknesses (study hours vs attendance).</li>
          </ul>
        </div>

        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#d97706', marginBottom: '10px', fontWeight: 700 }}>
            <ShieldAlert size={18} />
            <h4>Ethical & Limitations</h4>
          </div>
          <ul style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', paddingLeft: '18px', lineHeight: 1.6 }}>
            <li>Predictions are statistical estimates, not deterministic judgments.</li>
            <li>Synthetic training data should be augmented with empirical university records.</li>
            <li>Mental wellness and external socioeconomic factors are not modeled.</li>
          </ul>
        </div>

        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary)', marginBottom: '10px', fontWeight: 700 }}>
            <Sparkles size={18} />
            <h4>Future Enhancements</h4>
          </div>
          <ul style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', paddingLeft: '18px', lineHeight: 1.6 }}>
            <li>Deep Learning LSTM/Transformer modeling multi-semester longitudinal data.</li>
            <li>Role-Based Access Control (RBAC) for Faculty, Students, and HODs.</li>
            <li>Automated email / SMS alerts to academic advisors for at-risk cases.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
