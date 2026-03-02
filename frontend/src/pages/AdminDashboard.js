import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { adminAPI, ordersAPI } from '../services/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    total_products: 0,
    pending_products: 0,
    approved_products: 0,
    total_orders: 0,
  });
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [statsResponse, ordersResponse] = await Promise.all([adminAPI.stats(), ordersAPI.list()]);
      setStats(statsResponse.data);
      setOrders(ordersResponse.data.results || ordersResponse.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDeleteOrder = async (id) => {
    await ordersAPI.remove(id);
    setOrders((prev) => prev.filter((order) => order.id !== id));
    setStats((prev) => ({ ...prev, total_orders: Math.max(prev.total_orders - 1, 0) }));
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
      <h1 className="mb-3">Admin Dashboard</h1>

      <div className="grid grid-4 mb-4">
        <div className="stat-card"><div className="stat-content"><h3>{stats.total_products}</h3><p>Total products</p></div></div>
        <div className="stat-card"><div className="stat-content"><h3>{stats.pending_products}</h3><p>Pending products</p></div></div>
        <div className="stat-card"><div className="stat-content"><h3>{stats.approved_products}</h3><p>Approved products</p></div></div>
        <div className="stat-card"><div className="stat-content"><h3>{stats.total_orders}</h3><p>Total orders</p></div></div>
      </div>

      <div className="d-flex gap-2 mb-3">
        <Link to="/admin/pending" className="btn btn-outline">Review Pending Products</Link>
        <Link to="/admin/users" className="btn btn-outline">Manage Customers</Link>
      </div>

      <h2 className="mb-2">All Orders</h2>
      {orders.length === 0 ? (
        <div className="card p-3">No orders found.</div>
      ) : (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Product</th>
                <th>Customer</th>
                <th>Quantity</th>
                <th>Status</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>#{order.id}</td>
                  <td>{order.product?.name}</td>
                  <td>{order.customer?.username}</td>
                  <td>{order.quantity}</td>
                  <td>{order.order_status}</td>
                  <td>{new Date(order.created_at).toLocaleDateString()}</td>
                  <td>
                    <button className="btn btn-sm btn-danger" onClick={() => handleDeleteOrder(order.id)}>
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

export default AdminDashboard;
