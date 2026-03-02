import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { productsAPI } from '../services/api';

const CreateBusiness = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    image: null,
    video: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const payload = new FormData();
      payload.append('name', formData.name);
      payload.append('description', formData.description);
      payload.append('price', formData.price);
      if (formData.image) {
        payload.append('image', formData.image);
      }
      if (formData.video) {
        payload.append('video', formData.video);
      }

      await productsAPI.create(payload);
      navigate('/my-products');
    } catch (err) {
      setError(
        Object.values(err.response?.data || {}).flat().join(', ') || 'Failed to submit product.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ padding: '48px 0', maxWidth: '700px' }}>
      <div className="card p-3">
        <h1 className="mb-3">Submit Product</h1>
        <p className="text-muted mb-3">Upload product details with image or video.</p>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Product name</label>
            <input
              className="form-control"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              className="form-control"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Price (TZS)</label>
            <input
              type="number"
              min="0"
              step="0.01"
              className="form-control"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Product Image</label>
            <input
              type="file"
              accept="image/*"
              className="form-control"
              onChange={(e) => setFormData({ ...formData, image: e.target.files?.[0] || null })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Product Video</label>
            <input
              type="file"
              accept="video/*"
              className="form-control"
              onChange={(e) => setFormData({ ...formData, video: e.target.files?.[0] || null })}
            />
          </div>

          <div className="d-flex gap-2">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit Product'}
            </button>
            <Link to="/products" className="btn btn-outline">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateBusiness;
