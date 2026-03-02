import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { productsAPI } from '../services/api';

const BusinessList = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchProducts = async (query = '') => {
    setLoading(true);
    try {
      const response = await productsAPI.list({ search: query });
      setProducts(response.data.results || response.data);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchProducts(search);
  };

  return (
    <div className="container" style={{ padding: '48px 0' }}>
      <div className="d-flex justify-between align-center mb-3">
        <h1>Products</h1>
        <Link to="/products/new" className="btn btn-primary">
          Submit Product
        </Link>
      </div>

      <form onSubmit={handleSearch} className="card p-2 mb-3 d-flex gap-2">
        <input
          className="form-control"
          placeholder="Search products"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button className="btn btn-primary" type="submit">
          Search
        </button>
      </form>

      {loading ? (
        <div className="loading-container">
          <div className="spinner"></div>
        </div>
      ) : products.length === 0 ? (
        <div className="card p-3">No products found.</div>
      ) : (
        <div className="grid grid-3">
          {products.map((product) => (
            <Link key={product.id} to={`/products/${product.id}`} className="business-card">
              <div className="business-content">
                <h3 className="business-name">{product.name}</h3>
                <p className="business-description">{product.description}</p>
                <div className="business-meta">
                  <strong>{Number(product.price).toLocaleString()} TZS</strong>
                  <span>{product.status}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default BusinessList;
