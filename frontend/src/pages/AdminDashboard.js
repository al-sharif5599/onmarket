import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminAPI } from '../services/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    try {
      const response = await adminAPI.getStatistics();
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching statistics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '48px 0' }}>
        <div className="loading-container">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '48px 0' }}>
      <h1 className="mb-4">Admin Dashboard</h1>

      {/* Statistics Cards */}
      <div className="grid grid-4 mb-4">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'var(--primary)' }}>
            📊
          </div>
          <div className="stat-content">
            <h3>{stats.total}</h3>
            <p className="text-muted">Total Businesses</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'var(--warning)' }}>
            ⏳
          </div>
          <div className="stat-content">
            <h3>{stats.pending}</h3>
            <p className="text-muted">Pending Approval</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'var(--success)' }}>
            ✓
          </div>
          <div className="stat-content">
            <h3>{stats.approved}</h3>
            <p className="text-muted">Approved</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'var(--error)' }}>
            ✕
          </div>
          <div className="stat-content">
            <h3>{stats.rejected}</h3>
            <p className="text-muted">Rejected</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-2 mb-4">
        <div className="card">
          <h3>Business Management</h3>
          <div className="d-flex flex-column gap-2 mt-3">
            <Link to="/admin/pending" className="btn btn-outline">
              View Pending Approvals ({stats.pending})
            </Link>
            <Link to="/create-business" className="btn btn-outline">
              Post New Business
            </Link>
          </div>
        </div>

        <div className="card">
          <h3>User Management</h3>
          <div className="d-flex flex-column gap-2 mt-3">
            <Link to="/admin/users" className="btn btn-outline">
              Manage Users
            </Link>
            <Link to="/admin/businesses" className="btn btn-outline">
              All Businesses
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card">
        <h3>Quick Overview</h3>
        <div className="mt-3">
          <div className="d-flex justify-between align-center py-2 border-bottom">
            <span>Total Businesses</span>
            <strong>{stats.total}</strong>
          </div>
          <div className="d-flex justify-between align-center py-2 border-bottom">
            <span>Approval Rate</span>
            <strong>
              {stats.total > 0
                ? ((stats.approved / stats.total) * 100).toFixed(1)
                : 0}%
            </strong>
          </div>
          <div className="d-flex justify-between align-center py-2">
            <span>Pending Rate</span>
            <strong>
              {stats.total > 0
                ? ((stats.pending / stats.total) * 100).toFixed(1)
                : 0}%
            </strong>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
