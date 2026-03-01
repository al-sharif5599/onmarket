import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { businessesAPI, categoriesAPI } from '../services/api';

const Home = () => {
  const [businesses, setBusinesses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    fetchBusinesses();
    fetchCategories();
  }, []);

  const fetchBusinesses = async () => {
    try {
      const response = await businessesAPI.getAll();
      setBusinesses(response.data.results || response.data);
    } catch (error) {
      console.error('Error fetching businesses:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await categoriesAPI.getAll();
      setCategories(response.data.results || response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await businessesAPI.getAll({
        search: searchTerm,
        category: selectedCategory
      });
      setBusinesses(response.data.results || response.data);
    } catch (error) {
      console.error('Error searching businesses:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">
              Discover Amazing Businesses
            </h1>
            <p className="hero-subtitle">
              Find the best products and services from verified businesses in your area
            </p>
            
            {/* Search Form */}
            <form onSubmit={handleSearch} className="d-flex gap-2" style={{ maxWidth: '600px', margin: '0 auto' }}>
              <input
                type="text"
                className="form-control"
                placeholder="Search businesses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <select
                className="form-control"
                style={{ width: '200px' }}
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
              <button type="submit" className="btn btn-accent">
                Search
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="container" style={{ marginTop: '48px' }}>
        <h2 className="mb-3">Browse Categories</h2>
        <div className="grid grid-4">
          {categories.slice(0, 8).map((category) => (
            <Link
              key={category.id}
              to={`/businesses?category=${category.id}`}
              className="card"
              style={{ textAlign: 'center', padding: '24px' }}
            >
              <h3 style={{ color: 'var(--primary)' }}>{category.name}</h3>
              <p className="text-muted">{category.businesses_count || 0} businesses</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Businesses */}
      <section className="container" style={{ marginTop: '48px', marginBottom: '48px' }}>
        <div className="d-flex justify-between align-center mb-3">
          <h2>Featured Businesses</h2>
          <Link to="/businesses" className="btn btn-outline">
            View All
          </Link>
        </div>
        
        {loading ? (
          <div className="loading-container">
            <div className="spinner"></div>
          </div>
        ) : (
          <div className="grid grid-3">
            {businesses.slice(0, 6).map((business) => (
              <Link
                key={business.id}
                to={`/businesses/${business.id}`}
                className="business-card"
              >
                {business.primary_image && (
                  <img
                    src={business.primary_image}
                    alt={business.name}
                    className="business-image"
                  />
                )}
                <div className="business-content">
                  {business.category && (
                    <span className="business-category">{business.category.name}</span>
                  )}
                  <h3 className="business-name">{business.name}</h3>
                  <p className="business-description">{business.description}</p>
                  <div className="business-meta">
                    {business.price && (
                      <span className="business-price">${business.price}</span>
                    )}
                    <span>⭐ {business.average_rating?.toFixed(1) || '0.0'}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {businesses.length === 0 && !loading && (
          <div className="text-center p-4">
            <p className="text-muted">No businesses found. Be the first to post!</p>
            <Link to="/create-business" className="btn btn-primary mt-2">
              Post a Business
            </Link>
          </div>
        )}
      </section>

      {/* CTA Section */}
      <section style={{ background: 'var(--secondary)', padding: '64px 0', color: 'white' }}>
        <div className="container text-center">
          <h2 style={{ marginBottom: '16px' }}>Ready to Grow Your Business?</h2>
          <p style={{ marginBottom: '32px', opacity: 0.9 }}>
            Join thousands of business owners showcasing their products and services
          </p>
          <Link to="/register" className="btn btn-accent btn-lg">
            Get Started Today
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div>
              <h4 className="footer-title">OnMarket</h4>
              <p className="text-muted">Your trusted platform for discovering and sharing businesses.</p>
            </div>
            <div>
              <h4 className="footer-title">Quick Links</h4>
              <Link to="/businesses" className="footer-link">All Businesses</Link>
              <Link to="/register" className="footer-link">Register</Link>
              <Link to="/login" className="footer-link">Login</Link>
            </div>
            <div>
              <h4 className="footer-title">For Business</h4>
              <Link to="/create-business" className="footer-link">Post Your Business</Link>
              <Link to="/admin" className="footer-link">Admin Portal</Link>
            </div>
            <div>
              <h4 className="footer-title">Contact</h4>
              <p className="footer-link">support@onmarket.com</p>
              <p className="footer-link">+1 234 567 890</p>
            </div>
          </div>
          <div className="footer-bottom">
            <p>© 2024 OnMarket. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
