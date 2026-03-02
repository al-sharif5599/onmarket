import React, { useEffect, useState } from 'react';

import { productsAPI } from '../services/api';

const MyBusinesses = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({ name: '', description: '', price: '' });
  const [error, setError] = useState('');

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await productsAPI.myProducts();
      setProducts(response.data.results || response.data);
    } catch {
      setError('Failed to load products.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const startEdit = (product) => {
    setEditingId(product.id);
    setEditData({ name: product.name, description: product.description, price: product.price });
  };

  const saveEdit = async () => {
    try {
      await productsAPI.update(editingId, editData);
      setEditingId(null);
      fetchProducts();
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to update product.');
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
      <h1 className="mb-3">My Products</h1>
      {error && <div className="alert alert-error">{error}</div>}

      {products.length === 0 ? (
        <div className="card p-3">No products submitted yet.</div>
      ) : (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Price</th>
                <th>Status</th>
                <th>Created</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td>{product.name}</td>
                  <td>{Number(product.price).toLocaleString()} TZS</td>
                  <td>{product.status}</td>
                  <td>{new Date(product.created_at).toLocaleDateString()}</td>
                  <td>
                    {product.status === 'pending' && (
                      <button className="btn btn-sm btn-outline" onClick={() => startEdit(product)}>
                        Edit
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {editingId && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-body">
              <h3 className="mb-2">Edit Pending Product</h3>
              <div className="form-group">
                <label className="form-label">Name</label>
                <input
                  className="form-control"
                  value={editData.name}
                  onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  className="form-control"
                  value={editData.description}
                  onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Price</label>
                <input
                  type="number"
                  className="form-control"
                  value={editData.price}
                  onChange={(e) => setEditData({ ...editData, price: e.target.value })}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-primary" onClick={saveEdit}>
                Save
              </button>
              <button className="btn btn-outline" onClick={() => setEditingId(null)}>
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
