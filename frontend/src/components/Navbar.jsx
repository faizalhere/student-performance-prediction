import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, PlusCircle, Sparkles } from 'lucide-react';

export default function Navbar({ onToggleSidebar }) {
  const location = useLocation();

  const getPageTitle = (pathname) => {
    switch (pathname) {
      case '/': return 'Academic Analytics Dashboard';
      case '/predict': return 'Predict Student Performance';
      case '/history': return 'Saved Prediction History';
      case '/evaluation': return 'Model Training & Evaluation';
      case '/about': return 'About Project Architecture';
      default:
        if (pathname.startsWith('/result')) return 'Prediction Assessment Report';
        return 'EduPredict System';
    }
  };

  return (
    <header className="top-navbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button
          onClick={onToggleSidebar}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            display: 'none',
            color: 'var(--text-primary)'
          }}
          className="mobile-toggle-btn"
          aria-label="Toggle Navigation"
        >
          <Menu size={24} />
        </button>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
            {getPageTitle(location.pathname)}
          </h2>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
            Machine Learning Powered Examination Mark Prediction
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <Link to="/predict" className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
          <PlusCircle size={17} />
          <span>New Prediction</span>
        </Link>
      </div>
    </header>
  );
}
