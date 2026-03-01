import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminAPI } from '../services/api';

const PendingApprovals = () => {
  const [pendingBusinesses, setPendingBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    fetchPendingBusinesses();
  }, []);

  const fetchPendingBusinesses = async () => {
    try {
      const response = await adminAPI.getPending();
      setPendingBusinesses(response.data);
    } catch (error) {
      console.error('Error fetching pending businesses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    setActionLoading(id);
    try {
      await adminAPI.approveBusiness(id);
      setPendingBusinesses(pendingBusinesses.filter(b => b.id !== id));
      alert('Business approved successfully');
    } catch (error) {
      alert('Failed to approve business');
      console.error('Error approving business:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (id) => {
    if (!window.confirm('Are you sure you want to reject this business?')) {
      return;
    }
    
    setActionLoading(id);
    try {
      await adminAPI.rejectBusiness(id);
      setPendingBusinesses(pendingBusinesses.filter(b => b.id !== id));
      alert('Business rejected');
    } catch (error) {
      alert('Failed to reject business');
      console.error('Error rejecting business:', error);
    } finally {
      setActionLoading(null);
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
      <div className="d-flex justify-between align-center mb-4">
        <h1>Pending Approvals</h1>
        <Link to="/admin" className="btn btn-outline">
          Back to Dashboard
        </Link>
      </div>

      {pendingBusinesses.length === 0 ? (
        <div className="card text-center p-5">
          <h3>No pending businesses</h3>
          <p className="text-muted">All businesses have been reviewed</p>
        </div>
      ) : (
        <div className="pending-list">
          {pendingBusinesses.map((business) => (
            <div key={business.id} className="card mb-3">
              <div className="pending-item">
                <div className="pending-info">
                  <div className="d-flex align-center gap-2 mb-2">
                    <h3>{business.name}</h3>
                    <span className="badge badge-warning">Pending</span>
                  </div>
                  
                  {business.category && (
                    <p className="text-muted mb-2">
                      Category: {business.category.name}
                    </p>
                  )}
                  
                  <p className="mb-2">{business.description}</p>
                  
                  <div className="business-meta">
                    <span>By: {business.owner?.username}</span>
                    <span>Email: {business.contact_email}</span>
                    <span>Phone: {business.contact_phone}</span>
                    {business.price && <span>Price: ${business.price}</span>}
                  </div>
                  
                  <p className="text-muted mt-2">
                    Submitted: {new Date(business.created_at).toLocaleDateString()}
                  </p>
                </div>
                
                <div className="pending-actions">
                  <Link
                    to={`/businesses/${business.id}`}
                    className="btn btn-outline btn-sm mb-2"
                  >
                    View Details
                  </Link>
                  <div className="d-flex gap-2">
                    <button
                      className="btn btn-success btn-sm"
                      onClick={() => handleApprove(business.id)}
                      disabled={actionLoading === business.id}
                    >
                      {actionLoading === business.id ? '...' : 'Approve'}
                    </button>
                    <button
                      className="btn btn-error btn-sm"
                      onClick={() => handleReject(business.id)}
                      disabled={actionLoading === business.id}
                    >
                      {actionLoading === business.id ? '...' : 'Reject'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PendingApprovals;
