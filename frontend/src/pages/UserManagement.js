import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { adminAPI } from '../services/api';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirm_password: '',
  });

  const fetchUsers = async () => {
    try {
      const response = await adminAPI.users();
      setUsers(response.data.results || response.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const createUser = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setCreating(true);

    try {
      const response = await adminAPI.createUser(formData);
      setUsers((prev) => [response.data.user, ...prev]);
      setFormData({ username: '', email: '', password: '', confirm_password: '' });
      setSuccess('Customer registered successfully.');
    } catch (err) {
      setError(Object.values(err.response?.data || {}).flat().join(', ') || 'Failed to create user.');
    } finally {
      setCreating(false);
    }
  };

  const deleteUser = async (id) => {
    await adminAPI.deleteUser(id);
    setUsers((prev) => prev.filter((user) => user.id !== id));
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
      <div className="d-flex justify-between align-center mb-3">
        <h1>Customers</h1>
        <Link to="/admin" className="btn btn-outline">Back</Link>
      </div>

      <div className="card p-3 mb-3">
        <h3 className="mb-2">Register New User</h3>
        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}
        <form onSubmit={createUser} className="grid grid-2">
          <div className="form-group">
            <label className="form-label">Username</label>
            <input
              className="form-control"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              minLength={8}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Confirm Password</label>
            <input
              type="password"
              className="form-control"
              value={formData.confirm_password}
              onChange={(e) => setFormData({ ...formData, confirm_password: e.target.value })}
              required
              minLength={8}
            />
          </div>
          <div>
            <button type="submit" className="btn btn-primary" disabled={creating}>
              {creating ? 'Registering...' : 'Register User'}
            </button>
          </div>
        </form>
      </div>

      {users.length === 0 ? (
        <div className="card p-3">No customers found.</div>
      ) : (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Username</th>
                <th>Email</th>
                <th>Role</th>
                <th>Joined</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>{new Date(user.date_joined).toLocaleDateString()}</td>
                  <td>
                    <button className="btn btn-danger btn-sm" onClick={() => deleteUser(user.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
