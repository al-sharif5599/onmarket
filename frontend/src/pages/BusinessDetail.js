import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';
import { ordersAPI, productsAPI } from '../services/api';
import { inferVideoMimeType } from '../utils/media';

const BusinessDetail = () => {
  const { id } = useParams();
  const { isAuthenticated, isCustomer } = useAuth();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await productsAPI.detail(id);
        setProduct(response.data);
      } catch {
        setError('Failed to load product.');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleOrder = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      await ordersAPI.create({ product_id: Number(id), quantity: Number(quantity) });
      setMessage('Order placed successfully.');
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to place order.');
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

  if (!product) {
    return (
      <div className="container" style={{ padding: '48px 0' }}>
        <div className="alert alert-error">{error || 'Product not found.'}</div>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '48px 0', maxWidth: '900px' }}>
      <Link to="/products" className="btn btn-outline mb-3">
        Back to products
      </Link>

      <div className="card p-3">
        {product.image_url && (
          <img
            src={product.image_url}
            alt={product.name}
            style={{ width: '100%', maxHeight: '420px', objectFit: 'cover', borderRadius: '12px', marginBottom: '16px' }}
          />
        )}

        {product.video_url && (
          <>
            <video controls preload="metadata" style={{ width: '100%', borderRadius: '12px', marginBottom: '12px' }}>
              <source src={product.video_url} type={inferVideoMimeType(product.video_url)} />
              Your browser does not support this video format.
            </video>
            <div className="mb-3">
              <a href={product.video_url} target="_blank" rel="noreferrer" className="btn btn-outline btn-sm">
                Open/Download Video
              </a>
            </div>
          </>
        )}

        <h1 className="mb-2">{product.name}</h1>
        <p className="mb-3">{product.description}</p>
        <p className="mb-2">
          <strong>Price:</strong> {Number(product.price).toLocaleString()} TZS
        </p>
        <p className="mb-2">
          <strong>Status:</strong> {product.status}
        </p>
        <p className="mb-3">
          <strong>Posted by:</strong> {product.posted_by?.username}
        </p>

        {isAuthenticated && isCustomer && product.status === 'approved' && (
          <form onSubmit={handleOrder} className="d-flex gap-2 align-center">
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="form-control"
              style={{ maxWidth: '120px' }}
            />
            <button className="btn btn-primary" type="submit">
              Place Order
            </button>
          </form>
        )}

        {message && <div className="alert alert-success mt-2">{message}</div>}
        {error && <div className="alert alert-error mt-2">{error}</div>}
      </div>
    </div>
  );
};

export default BusinessDetail;
