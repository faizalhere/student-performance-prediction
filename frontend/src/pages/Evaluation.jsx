import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  TrendingUp,
  Cpu,
  Layers,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Award,
  ArrowRight
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  LineChart,
  Line,
  CartesianGrid
} from 'recharts';
import api from '../services/api';

export default function Evaluation() {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        setLoading(true);
        const data = await api.getMetrics();
        setMetrics(data);
        setError(null);
      } catch (err) {
        setError(err.message || 'Model evaluation metrics not yet available. Train models in backend first.');
      } finally {
        setLoading(false);
      }
    };
    fetchMetrics();
  }, []);

  if (loading) {
    return (
      <div className="page-wrapper" style={{ padding: '80px', textAlign: 'center', color: 'var(--text-secondary)' }}>
        <p>Loading model evaluation and held-out test data metrics...</p>
      </div>
    );
  }

  if (error || !metrics) {
    return (
      <div className="page-wrapper" style={{ maxWidth: '600px', textAlign: 'center', padding: '60px 20px' }}>
        <div className="card">
          <AlertCircle size={48} color="#dc2626" style={{ margin: '0 auto 16px auto' }} />
          <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '8px' }}>Metrics Not Available</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>
            {error || 'Run python train_model.py in the backend directory to train and evaluate regression models.'}
          </p>
        </div>
      </div>
    );
  }

  const { evaluations, best_model, feature_importances, comparison_points, dataset_summary } = metrics;

  const comparisonBarData = Object.entries(evaluations).map(([name, scores]) => ({
    name: name === 'Random Forest Regressor' ? 'Random Forest' : 'Linear Reg',
    MAE: scores.MAE,
    RMSE: scores.RMSE,
    R2: Number((scores.R2 * 100).toFixed(1)),
  }));

  return (
    <div className="page-wrapper">
      <div style={{ marginBottom: '28px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '4px 12px', background: 'var(--primary-light)', borderRadius: '9999px', fontSize: '0.8rem', fontWeight: 600, color: 'var(--primary)', marginBottom: '8px' }}>
          <Award size={16} />
          <span>Selected Champion Model: {best_model}</span>
        </div>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '6px' }}>
          Model Training & Empirical Evaluation
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          Rigorous regression benchmarks evaluated on held-out test data (20% split) to avoid data leakage.
        </p>
      </div>

      {/* Model Comparison Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', marginBottom: '32px' }}>
        {Object.entries(evaluations).map(([name, scores]) => {
          const isBest = name === best_model;
          return (
            <div
              key={name}
              className="card"
              style={{
                position: 'relative',
                border: isBest ? '2px solid var(--primary)' : '1px solid var(--border)',
                background: isBest ? 'linear-gradient(180deg, #ffffff 0%, #eff6ff 100%)' : '#ffffff',
              }}
            >
              {isBest && (
                <div
                  style={{
                    position: 'absolute',
                    top: '-12px',
                    right: '20px',
                    background: 'var(--primary)',
                    color: '#fff',
                    padding: '3px 12px',
                    borderRadius: '9999px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    boxShadow: '0 2px 8px rgba(37, 99, 235, 0.4)',
                  }}
                >
                  Best Test MAE
                </div>
              )}

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                <Cpu size={22} color={isBest ? 'var(--primary)' : 'var(--text-secondary)'} />
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>{name}</h3>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', textAlign: 'center', marginBottom: '16px' }}>
                <div style={{ padding: '12px 8px', background: '#ffffff', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>MAE</div>
                  <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-primary)' }}>{scores.MAE}</div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Lower is better</div>
                </div>

                <div style={{ padding: '12px 8px', background: '#ffffff', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>RMSE</div>
                  <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-primary)' }}>{scores.RMSE}</div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Lower is better</div>
                </div>

                <div style={{ padding: '12px 8px', background: '#ffffff', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>R² Score</div>
                  <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--primary)' }}>{scores.R2}</div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Max is 1.0</div>
                </div>
              </div>

              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                {name === 'Random Forest Regressor'
                  ? 'Captures non-linear student interaction effects and interaction between study hours and internal marks with ensemble trees.'
                  : 'Provides a clean parametric baseline calculating constant linear weights for each academic indicator.'}
              </p>
            </div>
          );
        })}
      </div>

      {/* Dataset Sizes and Split Card */}
      <div
        className="card"
        style={{
          padding: '20px 28px',
          marginBottom: '32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '20px',
          background: '#f8fafc',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <Layers size={28} color="var(--purple)" />
          <div>
            <h4 style={{ fontWeight: 700, fontSize: '0.98rem' }}>Dataset Split Specification</h4>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
              Reproducible train/test split with seed 42 to guarantee zero data leakage.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '28px', flexWrap: 'wrap' }}>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Total Records</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800 }}>{dataset_summary?.total_samples || 600}</div>
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Training Set (80%)</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary)' }}>{dataset_summary?.train_samples || 480}</div>
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Held-Out Test (20%)</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--purple)' }}>{dataset_summary?.test_samples || 120}</div>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(460px, 1fr))', gap: '28px', marginBottom: '32px' }}>
        {/* Actual vs Predicted on Test Set */}
        <div className="card">
          <div style={{ marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Actual vs Predicted Final Marks</h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
              Sample test points comparing ground-truth test labels with model predictions.
            </p>
          </div>

          <div style={{ width: '100%', height: 280 }}>
            <ResponsiveContainer>
              <LineChart data={comparison_points}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="id" tick={{ fontSize: 11 }} label={{ value: 'Test Student Sample', position: 'insideBottom', offset: -4, fontSize: 11 }} />
                <YAxis domain={[30, 100]} tick={{ fontSize: 11 }} label={{ value: 'Marks', angle: -90, position: 'insideLeft', fontSize: 11 }} />
                <Tooltip />
                <Legend verticalAlign="top" height={36} />
                <Line type="monotone" dataKey="actual" name="Actual Examination Mark" stroke="#0f172a" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="predicted" name="Model Prediction" stroke="#2563eb" strokeWidth={2} strokeDasharray="4 4" dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Feature Importance Bar Chart */}
        <div className="card">
          <div style={{ marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Feature Importance Analysis</h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
              Gini impurity importance contribution per academic indicator (Random Forest).
            </p>
          </div>

          <div style={{ width: '100%', height: 280 }}>
            <ResponsiveContainer>
              <BarChart data={feature_importances} layout="vertical" margin={{ left: 30, right: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis type="number" domain={[0, 50]} unit="%" tick={{ fontSize: 11 }} />
                <YAxis dataKey="feature" type="category" tick={{ fontSize: 11 }} />
                <Tooltip formatter={(value) => [`${value}%`, 'Importance Weight']} />
                <Bar dataKey="importance" fill="#7c3aed" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Explanatory Guide to Metrics */}
      <div className="card">
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px' }}>Understanding Evaluation Metrics</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
          <div>
            <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '4px' }}>
              Mean Absolute Error (MAE)
            </h4>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Measures the average magnitude of absolute errors between predictions and actual marks. An MAE of ~2.2 means predictions are on average within ±2.2 marks of actual final scores.
            </p>
          </div>

          <div>
            <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--purple)', marginBottom: '4px' }}>
              Root Mean Squared Error (RMSE)
            </h4>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Penalizes larger outliers more heavily than MAE by squaring deviations before averaging. Crucial in academic analytics where large single-student errors must be guarded against.
            </p>
          </div>

          <div>
            <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: '#059669', marginBottom: '4px' }}>
              Coefficient of Determination (R²)
            </h4>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Represents the proportion of variance in final examination marks explained by the input features. A score over 0.90 indicates strong predictive alignment.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
