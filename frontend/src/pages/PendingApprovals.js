import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { adminAPI, productsAPI } from '../services/api';

const PendingApprovals = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPending = async () => {
    setLoading(true);
    try {
      const response = await productsAPI.list({ status: 'pending' });
      setProducts(response.data.results || response.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPending();
  }, []);

  const approve = async (id) => {
    await adminAPI.approveProduct(id);
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const reject = async (id) => {
    await adminAPI.rejectProduct(id);
    setProducts((prev) => prev.filter((p) => p.id !== id));
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
        <h1>Pending Products</h1>
        <Link to="/admin" className="btn btn-outline">Back</Link>
      </div>

      {products.length === 0 ? (
        <div className="card p-3">No pending products.</div>
      ) : (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Description</th>
                <th>Price</th>
                <th>Posted by</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td>{product.name}</td>
                  <td>{product.description}</td>
                  <td>{Number(product.price).toLocaleString()} TZS</td>
                  <td>{product.posted_by?.username}</td>
                  <td>{new Date(product.created_at).toLocaleDateString()}</td>
                  <td>
                    <div className="d-flex gap-1">
                      <button className="btn btn-success btn-sm" onClick={() => approve(product.id)}>Approve</button>
                      <button className="btn btn-danger btn-sm" onClick={() => reject(product.id)}>Reject</button>
                    </div>
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

export default PendingApprovals;
