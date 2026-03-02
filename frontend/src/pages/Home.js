import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { productsAPI } from '../services/api';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await productsAPI.list({ status: 'approved' });
        setProducts(response.data.results || response.data);
      } catch {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div>
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">Simple Product Selling System</h1>
            <p className="hero-subtitle">
              Admin and customers can manage products and orders in one centralized platform.
            </p>
            <div className="d-flex gap-2 justify-center">
              <Link to="/products" className="btn btn-accent">
                View Products
              </Link>
              <Link to="/register" className="btn btn-outline" style={{ color: '#fff', borderColor: '#fff' }}>
                Create Account
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="container" style={{ marginTop: '48px', marginBottom: '48px' }}>
        <div className="d-flex justify-between align-center mb-3">
          <h2>Approved Products</h2>
          <Link to="/products" className="btn btn-outline">
            View All
          </Link>
        </div>

        {loading ? (
          <div className="loading-container">
            <div className="spinner"></div>
          </div>
        ) : products.length === 0 ? (
          <div className="card p-3">No approved products yet.</div>
        ) : (
          <div className="grid grid-3">
            {products.slice(0, 6).map((product) => (
              <Link key={product.id} to={`/products/${product.id}`} className="business-card">
                <div className="business-content">
                  <h3 className="business-name">{product.name}</h3>
                  <p className="business-description">{product.description}</p>
                  <div className="business-meta">
                    <strong>{Number(product.price).toLocaleString()} TZS</strong>
                    <span>View</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
