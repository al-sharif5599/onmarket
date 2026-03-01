import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          On<span>Market</span>
        </Link>

        <div className="navbar-menu">
          <Link to="/businesses" className="navbar-item">
            Businesses
          </Link>
          
          {isAuthenticated && !isAdmin && (
            <Link to="/create-business" className="navbar-item">
              Post Business
            </Link>
          )}
          
          {isAdmin && (
            <>
              <Link to="/admin" className="navbar-item">
                Dashboard
              </Link>
              <Link to="/admin/pending" className="navbar-item">
                Pending
              </Link>
            </>
          )}
        </div>

        <div className="navbar-actions">
          {isAuthenticated ? (
            <>
              <Link to="/my-businesses" className="navbar-item">
                My Businesses
              </Link>
              <span className={`badge badge-${user?.role}`}>
                {user?.username}
              </span>
              <button onClick={handleLogout} className="btn btn-outline btn-sm">
                Logout
              </button>
            </>
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
