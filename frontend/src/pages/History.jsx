import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  History as HistoryIcon,
  Search,
  ArrowUpDown,
  Trash2,
  Eye,
  AlertCircle,
  GraduationCap,
  Calendar,
  Clock,
  RotateCcw,
  X,
  CheckCircle2,
  Check
} from 'lucide-react';
import api from '../services/api';

export default function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('latest');
  const [selectedItem, setSelectedItem] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchHistoryData = async () => {
    try {
      setLoading(true);
      const data = await api.getHistory(searchTerm, sortBy);
      setHistory(data);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to load prediction history');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistoryData();
  }, [sortBy]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchHistoryData();
  };

  const handleDelete = async (id) => {
    try {
      setDeleteLoading(true);
      await api.deleteHistory(id);
      setDeleteConfirmId(null);
      if (selectedItem?.id === id) setSelectedItem(null);
      await fetchHistoryData();
    } catch (err) {
      alert(`Deletion failed: ${err.message}`);
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="page-wrapper">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '6px' }}>
            Prediction History
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
            All past student evaluation records saved persistently in the SQLite database.
          </p>
        </div>

        <Link to="/predict" className="btn btn-primary" style={{ padding: '10px 20px' }}>
          <GraduationCap size={18} />
          <span>New Prediction</span>
        </Link>
      </div>

      {error && (
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
          <div>{error}</div>
        </div>
      )}

      {/* Filter and Search Bar Card */}
      <div
        className="card"
        style={{
          padding: '16px 20px',
          marginBottom: '24px',
          display: 'flex',
          gap: '16px',
          alignItems: 'center',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
        }}
      >
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '10px', flex: '1 1 300px' }}>
          <div style={{ position: 'relative', width: '100%' }}>
            <Search
              size={18}
              style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}
            />
            <input
              type="text"
              placeholder="Search by student name or category..."
              className="form-input"
              style={{ paddingLeft: '38px', height: '42px' }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-secondary" style={{ padding: '0 16px', height: '42px' }}>
            Search
          </button>
        </form>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            <ArrowUpDown size={16} />
            <span>Sort by:</span>
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="form-input"
            style={{ width: 'auto', height: '42px', padding: '0 14px', fontSize: '0.85rem' }}
          >
            <option value="latest">Latest First</option>
            <option value="oldest">Oldest First</option>
            <option value="marks_high">Marks: High to Low</option>
            <option value="marks_low">Marks: Low to High</option>
          </select>

          <button
            onClick={() => {
              setSearchTerm('');
              setSortBy('latest');
              fetchHistoryData();
            }}
            className="btn btn-outline"
            style={{ height: '42px', padding: '0 12px' }}
            title="Reset Filters"
          >
            <RotateCcw size={16} />
          </button>
        </div>
      </div>

      {/* History Table Card */}
      <div className="card">
        {loading ? (
          <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-secondary)' }}>
            <p>Loading prediction history records...</p>
          </div>
        ) : history.length > 0 ? (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Student Name</th>
                  <th>Attendance</th>
                  <th>Study Hours</th>
                  <th>Predicted Marks</th>
                  <th>Performance Category</th>
                  <th>Date & Time</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {history.map((row) => {
                  let badgeClass = 'badge-good';
                  if (row.category === 'Excellent') badgeClass = 'badge-excellent';
                  if (row.category === 'Needs Improvement') badgeClass = 'badge-improvement';
                  if (row.category === 'At Risk') badgeClass = 'badge-risk';

                  return (
                    <tr key={row.id}>
                      <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>#{row.id}</td>
                      <td style={{ fontWeight: 600 }}>{row.student_name}</td>
                      <td>{row.attendance}%</td>
                      <td>{row.study_hours} hrs/d</td>
                      <td style={{ fontWeight: 700, color: 'var(--primary)', fontSize: '0.98rem' }}>
                        {row.predicted_mark} / 100
                      </td>
                      <td>
                        <span className={`badge ${badgeClass}`}>{row.category}</span>
                      </td>
                      <td style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{row.timestamp}</td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '8px' }}>
                          <button
                            onClick={() => setSelectedItem(row)}
                            className="btn btn-outline"
                            style={{ padding: '6px 10px', fontSize: '0.8rem' }}
                            title="View Full Report"
                          >
                            <Eye size={15} />
                            <span>Details</span>
                          </button>

                          <button
                            onClick={() => setDeleteConfirmId(row.id)}
                            className="btn btn-danger-outline"
                            title="Delete Record"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ padding: '60px 20px', textAlign: 'center', color: 'var(--text-secondary)' }}>
            <HistoryIcon size={44} style={{ margin: '0 auto 12px auto', opacity: 0.4 }} />
            <h3 style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px' }}>No predictions found</h3>
            <p style={{ fontSize: '0.88rem', marginBottom: '20px' }}>
              {searchTerm ? 'No records match your search criteria.' : 'No student records have been saved yet.'}
            </p>
            <Link to="/predict" className="btn btn-primary" style={{ fontSize: '0.88rem' }}>
              <GraduationCap size={16} />
              <span>Make a New Prediction</span>
            </Link>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px',
          }}
        >
          <div className="card" style={{ maxWidth: '420px', width: '100%', padding: '28px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '10px', color: '#dc2626' }}>
              Confirm Deletion
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '24px' }}>
              Are you sure you want to permanently delete prediction record <strong>#{deleteConfirmId}</strong> from the database? This action cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                className="btn btn-outline"
                onClick={() => setDeleteConfirmId(null)}
                disabled={deleteLoading}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary"
                style={{ background: '#dc2626' }}
                onClick={() => handleDelete(deleteConfirmId)}
                disabled={deleteLoading}
              >
                {deleteLoading ? 'Deleting...' : 'Yes, Delete Record'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {selectedItem && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px',
          }}
        >
          <div className="card" style={{ maxWidth: '600px', width: '100%', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>
                Prediction Assessment #{selectedItem.id}
              </h3>
              <button
                onClick={() => setSelectedItem(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ padding: '16px', background: '#f8fafc', borderRadius: 'var(--radius-md)', marginBottom: '20px' }}>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '4px' }}>
                {selectedItem.student_name}
              </div>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center', fontSize: '0.85rem' }}>
                <span className="badge badge-good">{selectedItem.category}</span>
                <span style={{ color: 'var(--text-secondary)' }}>Score: {selectedItem.predicted_mark} / 100</span>
                <span style={{ color: 'var(--text-muted)' }}>• {selectedItem.timestamp}</span>
              </div>
            </div>

            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '12px' }}>Academic Inputs</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px' }}>
              <div style={{ padding: '8px 12px', background: '#f8fafc', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem' }}>
                Attendance: <strong>{selectedItem.attendance}%</strong>
              </div>
              <div style={{ padding: '8px 12px', background: '#f8fafc', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem' }}>
                Assignment: <strong>{selectedItem.assignment_score} / 100</strong>
              </div>
              <div style={{ padding: '8px 12px', background: '#f8fafc', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem' }}>
                Internal: <strong>{selectedItem.internal_assessment} / 30</strong>
              </div>
              <div style={{ padding: '8px 12px', background: '#f8fafc', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem' }}>
                Study: <strong>{selectedItem.study_hours} hrs/day</strong>
              </div>
              <div style={{ gridColumn: '1 / -1', padding: '8px 12px', background: '#f8fafc', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem' }}>
                Previous Marks: <strong>{selectedItem.previous_marks} / 100</strong>
              </div>
            </div>

            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '12px' }}>Model Recommendations</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px' }}>
              {selectedItem.recommendations && selectedItem.recommendations.map((rec, i) => (
                <div key={i} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', fontSize: '0.85rem' }}>
                  <CheckCircle2 size={16} color="var(--primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span>{rec}</span>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button className="btn btn-secondary" onClick={() => setSelectedItem(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
