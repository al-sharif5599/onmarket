import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminAPI } from '../services/api';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [deleteModal, setDeleteModal] = useState({ show: false, user: null });
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roleFilter]);

  const fetchUsers = async () => {
    try {
      const params = {};
      if (roleFilter) {
        params.role = roleFilter;
      }
      const response = await adminAPI.getUsers(params);
      setUsers(response.data.results || response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    setActionLoading(userId);
    try {
      await adminAPI.updateUser(userId, { role: newRole });
      setUsers(users.map(u => 
        u.id === userId ? { ...u, role: newRole } : u
      ));
      alert('User role updated successfully');
    } catch (error) {
      alert('Failed to update user role');
      console.error('Error updating user:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteUser = async () => {
    if (!deleteModal.user) return;
    
    setActionLoading(deleteModal.user.id);
    try {
      await adminAPI.deleteUser(deleteModal.user.id);
      setUsers(users.filter(u => u.id !== deleteModal.user.id));
      setDeleteModal({ show: false, user: null });
      alert('User deleted successfully');
    } catch (error) {
      alert('Failed to delete user');
      console.error('Error deleting user:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const filteredUsers = users.filter(user => 
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleBadge = (role) => {
    const roleClasses = {
      admin: 'badge-primary',
      customer: 'badge-secondary',
    };
    return `badge ${roleClasses[role] || 'badge-default'}`;
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
        <h1>User Management</h1>
        <Link to="/admin" className="btn btn-outline">
          Back to Dashboard
        </Link>
      </div>

      {/* Filters */}
      <div className="card mb-4">
        <div className="d-flex gap-3">
          <input
            type="text"
            className="form-control"
            placeholder="Search by username or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ flex: 1 }}
          />
          <select
            className="form-control"
            style={{ width: '200px' }}
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="">All Roles</option>
            <option value="admin">Admin</option>
            <option value="customer">Customer</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      {filteredUsers.length === 0 ? (
        <div className="card text-center p-5">
          <h3>No users found</h3>
          <p className="text-muted">Try adjusting your search or filter</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>User</th>
                <th>Email</th>
                <th>Role</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td>
                    <div className="d-flex align-center gap-2">
                      <div className="user-avatar">
                        {user.username?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <strong>{user.username}</strong>
                        {user.first_name && user.last_name && (
                          <p className="text-muted mb-0" style={{ fontSize: '12px' }}>
                            {user.first_name} {user.last_name}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td>{user.email}</td>
                  <td>
                    <span className={getRoleBadge(user.role)}>
                      {user.role}
                    </span>
                  </td>
                  <td>{new Date(user.date_joined).toLocaleDateString()}</td>
                  <td>
                    <div className="d-flex gap-2">
                      <select
                        className="form-control form-control-sm"
                        style={{ width: '120px' }}
                        value={user.role}
                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                        disabled={actionLoading === user.id}
                      >
                        <option value="customer">Customer</option>
                        <option value="admin">Admin</option>
                      </select>
                      <button
                        className="btn btn-sm btn-error"
                        onClick={() => setDeleteModal({ show: true, user })}
                        disabled={actionLoading === user.id}
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

      {/* Delete Confirmation Modal */}
      {deleteModal.show && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Confirm Delete User</h3>
            <p>
              Are you sure you want to delete user 
              <strong> {deleteModal.user?.username}</strong>? 
              This will also delete all their businesses.
            </p>
            <div className="modal-actions">
              <button
                className="btn btn-error"
                onClick={handleDeleteUser}
                disabled={actionLoading}
              >
                {actionLoading ? 'Deleting...' : 'Delete User'}
              </button>
              <button
                className="btn btn-outline"
                onClick={() => setDeleteModal({ show: false, user: null })}
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

export default UserManagement;
