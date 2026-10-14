import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  GraduationCap,
  TrendingUp,
  Award,
  AlertCircle,
  ArrowRight,
  Sparkles,
  BarChart2,
  Clock,
  CheckCircle,
  FileText
} from 'lucide-react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis
} from 'recharts';
import api from '../services/api';

const CATEGORY_COLORS = {
  Excellent: '#10b981',
  Good: '#2563eb',
  'Needs Improvement': '#f59e0b',
  'At Risk': '#ef4444',
};

export default function Home() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const data = await api.getDashboard();
      setDashboard(data);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to connect to backend server');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const chartData = dashboard?.category_counts
    ? Object.entries(dashboard.category_counts).map(([name, value]) => ({
        name,
        value,
      }))
    : [];

  return (
    <div className="page-wrapper">
      {/* Hero Welcome Banner */}
      <div
        className="card"
        style={{
          background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
          color: '#fff',
          padding: '36px',
          marginBottom: '32px',
          border: 'none',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '-40px',
            right: '-40px',
            width: '260px',
            height: '260px',
            background: 'radial-gradient(circle, rgba(124, 58, 237, 0.35) 0%, rgba(37, 99, 235, 0.1) 70%)',
            borderRadius: '50%',
            filter: 'blur(30px)',
            pointerEvents: 'none',
          }}
        />

        <div style={{ maxWidth: '680px', position: 'relative', zIndex: 1 }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 14px',
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '9999px',
              fontSize: '0.82rem',
              fontWeight: 600,
              color: '#93c5fd',
              marginBottom: '16px',
            }}
          >
            <Sparkles size={16} />
            <span>AI-Driven Academic Foresight</span>
          </div>

          <h1
            style={{
              fontSize: '2.1rem',
              fontWeight: 800,
              lineHeight: 1.2,
              marginBottom: '12px',
              letterSpacing: '-0.02em',
            }}
          >
            Student Performance Prediction System
          </h1>

          <p
            style={{
              fontSize: '0.98rem',
              color: '#cbd5e1',
              lineHeight: 1.6,
              marginBottom: '24px',
            }}
          >
            Predict expected final examination marks accurately using machine learning trained on academic attendance,
            internal assessments, assignment scores, daily study hours, and historical scores.
          </p>

          <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
            <Link to="/predict" className="btn btn-primary" style={{ padding: '12px 24px' }}>
              <GraduationCap size={18} />
              <span>Predict Student Marks</span>
              <ArrowRight size={16} />
            </Link>
            <Link to="/evaluation" className="btn" style={{ background: 'rgba(255, 255, 255, 0.12)', color: '#fff' }}>
              <BarChart2 size={18} />
              <span>View Model Evaluation</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Error notification if backend offline */}
      {error && (
        <div
          style={{
            padding: '16px 20px',
            backgroundColor: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: 'var(--radius-md)',
            color: '#991b1b',
            marginBottom: '28px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <AlertCircle size={20} />
          <div>
            <strong>Backend Connection Notice:</strong> {error}. Ensure the Flask server is running on port 5000.
          </div>
        </div>
      )}

      {/* Statistics Row */}
      <div className="stat-grid">
        <div className="stat-card">
          <div className="stat-icon-wrapper stat-icon-blue">
            <GraduationCap size={26} />
          </div>
          <div>
            <div className="stat-value">{dashboard?.total_predictions ?? 0}</div>
            <div className="stat-label">Total Predictions Made</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper stat-icon-purple">
            <TrendingUp size={26} />
          </div>
          <div>
            <div className="stat-value">
              {dashboard?.has_data ? `${dashboard.average_mark}%` : 'N/A'}
            </div>
            <div className="stat-label">Average Predicted Score</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper stat-icon-emerald">
            <Award size={26} />
          </div>
          <div>
            <div className="stat-value">
              {dashboard?.has_data ? `${dashboard.highest_mark}%` : 'N/A'}
            </div>
            <div className="stat-label">Highest Predicted Score</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper stat-icon-amber">
            <AlertCircle size={26} />
          </div>
          <div>
            <div className="stat-value">
              {dashboard?.has_data ? `${dashboard.lowest_mark}%` : 'N/A'}
            </div>
            <div className="stat-label">Lowest Predicted Score</div>
          </div>
        </div>
      </div>

      {/* Main Dashboard Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '28px', marginBottom: '32px' }}>
        {/* Category Breakdown Chart */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Performance Distribution</h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Based on saved history</span>
          </div>

          {dashboard?.has_data && chartData.some((d) => d.value > 0) ? (
            <div style={{ width: '100%', height: 260 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {chartData.map((entry) => (
                      <Cell key={`cell-${entry.name}`} fill={CATEGORY_COLORS[entry.name] || '#64748b'} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value, name) => [`${value} Students`, name]} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div
              style={{
                height: 240,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text-muted)',
                textAlign: 'center',
                padding: '20px',
              }}
            >
              <FileText size={44} style={{ marginBottom: '12px', opacity: 0.5 }} />
              <p style={{ fontWeight: 600 }}>No prediction data yet</p>
              <p style={{ fontSize: '0.85rem' }}>Predictions made will automatically populate this performance distribution chart.</p>
            </div>
          )}
        </div>

        {/* Quick Workflow Cards */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '8px' }}>System Architecture</h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '18px' }}>
              Academic evaluation models trained and validated with rigorous regression metrics:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '12px', background: '#f8fafc', borderRadius: 'var(--radius-md)' }}>
                <CheckCircle size={20} color="#10b981" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>Random Forest & Linear Regression</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Evaluated on held-out test data for minimal MAE and high R² correlation.</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '12px', background: '#f8fafc', borderRadius: 'var(--radius-md)' }}>
                <CheckCircle size={20} color="#2563eb" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>SQLite Persistent Storage</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Complete student prediction history with instant query and delete support.</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '12px', background: '#f8fafc', borderRadius: 'var(--radius-md)' }}>
                <CheckCircle size={20} color="#7c3aed" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>Diagnostic Academic Advisory</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Generates actionable suggestions targeting attendance, assignment, and study hours.</div>
                </div>
              </div>
            </div>
          </div>

          <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'flex-end' }}>
            <Link to="/about" style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              Learn more about the project <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Predictions Table */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Recent Prediction Activity</h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>Latest students evaluated through the system</p>
          </div>
          <Link to="/history" className="btn btn-outline" style={{ fontSize: '0.82rem', padding: '6px 14px' }}>
            <span>View Full History</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {dashboard?.recent_activity && dashboard.recent_activity.length > 0 ? (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Student Name</th>
                  <th>Attendance</th>
                  <th>Predicted Marks</th>
                  <th>Performance Category</th>
                  <th>Date & Time</th>
                </tr>
              </thead>
              <tbody>
                {dashboard.recent_activity.map((item) => {
                  let badgeClass = 'badge-good';
                  if (item.category === 'Excellent') badgeClass = 'badge-excellent';
                  if (item.category === 'Needs Improvement') badgeClass = 'badge-improvement';
                  if (item.category === 'At Risk') badgeClass = 'badge-risk';

                  return (
                    <tr key={item.id}>
                      <td style={{ fontWeight: 600 }}>{item.student_name}</td>
                      <td>{item.attendance}%</td>
                      <td style={{ fontWeight: 700, color: 'var(--primary)' }}>
                        {item.predicted_mark} / 100
                      </td>
                      <td>
                        <span className={`badge ${badgeClass}`}>{item.category}</span>
                      </td>
                      <td style={{ color: 'var(--text-secondary)', fontSize: '0.82rem' }}>
                        {item.timestamp}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div
            style={{
              padding: '36px 20px',
              textAlign: 'center',
              color: 'var(--text-secondary)',
            }}
          >
            <Clock size={36} style={{ margin: '0 auto 12px auto', opacity: 0.4 }} />
            <h4 style={{ fontWeight: 600, color: 'var(--text-primary)' }}>No recent activity found</h4>
            <p style={{ fontSize: '0.85rem', marginBottom: '16px' }}>Run your first student prediction to begin tracking performance records.</p>
            <Link to="/predict" className="btn btn-primary" style={{ fontSize: '0.85rem' }}>
              <GraduationCap size={16} />
              <span>Predict Student Now</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
