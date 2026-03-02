import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { isAdmin, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          On<span>Market</span>
        </Link>

        <div className="navbar-menu">
          <Link to="/products" className="navbar-item">
            Products
          </Link>

          {isAuthenticated && !isAdmin && (
            <>
              <Link to="/products/new" className="navbar-item">
                Submit Product
              </Link>
              <Link to="/my-products" className="navbar-item">
                My Products
              </Link>
              <Link to="/my-orders" className="navbar-item">
                My Orders
              </Link>
            </>
          )}

          {isAdmin && (
            <>
              <Link to="/admin" className="navbar-item">
                Admin Dashboard
              </Link>
              <Link to="/products/new" className="navbar-item">
                Post Product
              </Link>
              <Link to="/admin/pending" className="navbar-item">
                Pending Products
              </Link>
              <Link to="/admin/users" className="navbar-item">
                Customers
              </Link>
            </>
          )}
        </div>

        <div className="navbar-actions">
          {isAuthenticated ? (
            <button onClick={handleLogout} className="btn btn-outline btn-sm">
              Logout
            </button>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline btn-sm">
                Login
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
