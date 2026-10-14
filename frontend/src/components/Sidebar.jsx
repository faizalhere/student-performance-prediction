import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  GraduationCap,
  History,
  BarChart3,
  Info,
  CheckCircle2,
  XCircle,
  Cpu
} from 'lucide-react';
import api from '../services/api';

export default function Sidebar({ isOpen, onClose }) {
  const [backendStatus, setBackendStatus] = useState({ online: false, model: 'Checking...' });

  useEffect(() => {
    let mounted = true;
    const check = async () => {
      try {
        const res = await api.getHealth();
        if (mounted) {
          setBackendStatus({
            online: res.status === 'healthy',
            model: res.model_name || 'Active'
          });
        }
      } catch (err) {
        if (mounted) {
          setBackendStatus({ online: false, model: 'Offline' });
        }
      }
    };
    check();
    const interval = setInterval(check, 10000);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  const navItems = [
    { to: '/', label: 'Home Dashboard', icon: LayoutDashboard },
    { to: '/predict', label: 'Predict Performance', icon: GraduationCap },
    { to: '/history', label: 'Prediction History', icon: History },
    { to: '/evaluation', label: 'Model Evaluation', icon: BarChart3 },
    { to: '/about', label: 'About Project', icon: Info },
  ];

  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-header">
        <div className="logo-icon">
          <GraduationCap size={24} />
        </div>
        <div>
          <h1 className="brand-title">EduPredict AI</h1>
          <p className="brand-subtitle">Academic Intelligence</p>
        </div>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              onClick={onClose}
            >
              <Icon size={19} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <div className="system-badge">
          <div className={`status-dot ${backendStatus.online ? '' : 'offline'}`} />
          <div style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            <div style={{ fontWeight: 600, color: backendStatus.online ? '#e2e8f0' : '#f87171' }}>
              {backendStatus.online ? 'Backend Connected' : 'Backend Offline'}
            </div>
            <div style={{ fontSize: '0.7rem', color: '#64748b' }}>
              Model: {backendStatus.model}
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
