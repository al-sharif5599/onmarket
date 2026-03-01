import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { businessesAPI } from '../services/api';

const MyBusinesses = () => {
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteModal, setDeleteModal] = useState({ show: false, id: null });
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchMyBusinesses();
  }, []);

  const fetchMyBusinesses = async () => {
    try {
      const response = await businessesAPI.getMyBusinesses();
      setBusinesses(response.data);
    } catch (error) {
      setError('Failed to load your businesses');
      console.error('Error fetching businesses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteModal.id) return;
    
    setDeleting(true);
    try {
      await businessesAPI.delete(deleteModal.id);
      setBusinesses(businesses.filter(b => b.id !== deleteModal.id));
      setDeleteModal({ show: false, id: null });
      alert('Business deleted successfully');
    } catch (error) {
      alert('Failed to delete business');
      console.error('Error deleting business:', error);
    } finally {
      setDeleting(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      pending: 'badge-warning',
      approved: 'badge-success',
      rejected: 'badge-error',
    };
    return `badge ${statusClasses[status] || 'badge-default'}`;
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
        <h1>My Businesses</h1>
        <Link to="/create-business" className="btn btn-primary">
          + Add New Business
        </Link>
      </div>

      {error && <div className="alert alert-error mb-3">{error}</div>}

      {businesses.length === 0 ? (
        <div className="card text-center p-5">
          <h3>No businesses yet</h3>
          <p className="text-muted">Start by creating your first business listing</p>
          <Link to="/create-business" className="btn btn-primary mt-3">
            Create Your First Business
          </Link>
        </div>
      ) : (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Business</th>
                <th>Category</th>
                <th>Price</th>
                <th>Status</th>
                <th>Views</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {businesses.map((business) => (
                <tr key={business.id}>
                  <td>
                    <div className="d-flex align-center gap-2">
                      {business.primary_image && (
                        <img
                          src={business.primary_image}
                          alt={business.name}
                          className="table-thumbnail"
                        />
                      )}
                      <div>
                        <Link to={`/businesses/${business.id}`} className="text-primary">
                          <strong>{business.name}</strong>
                        </Link>
                        <p className="text-muted mb-0" style={{ fontSize: '12px' }}>
                          {business.description?.substring(0, 50)}...
                        </p>
                      </div>
                    </div>
                  </td>
                  <td>{business.category?.name || '-'}</td>
                  <td>${business.price || '-'}</td>
                  <td>
                    <span className={getStatusBadge(business.status)}>
                      {business.status}
                    </span>
                  </td>
                  <td>{business.views}</td>
                  <td>{new Date(business.created_at).toLocaleDateString()}</td>
                  <td>
                    <div className="d-flex gap-2">
                      <Link
                        to={`/businesses/${business.id}`}
                        className="btn btn-sm btn-outline"
                      >
                        View
                      </Link>
                      <button
                        className="btn btn-sm btn-error"
                        onClick={() => setDeleteModal({ show: true, id: business.id })}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {deleteModal.show && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Confirm Delete</h3>
            <p>Are you sure you want to delete this business? This action cannot be undone.</p>
            <div className="modal-actions">
              <button
                className="btn btn-error"
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
              <button
                className="btn btn-outline"
                onClick={() => setDeleteModal({ show: false, id: null })}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyBusinesses;
