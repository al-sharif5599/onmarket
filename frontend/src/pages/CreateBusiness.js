import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { businessesAPI, categoriesAPI } from '../services/api';

const CreateBusiness = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
    contact_email: '',
    contact_phone: '',
    address: '',
    website: '',
  });
  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await categoriesAPI.getAll();
      setCategories(response.data.results || response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setCategoriesLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear error when user types
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
  };

  const handleVideoChange = (e) => {
    const files = Array.from(e.target.files);
    setVideos(files);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Business name is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.contact_email.trim()) newErrors.contact_email = 'Email is required';
    if (!formData.contact_phone.trim()) newErrors.contact_phone = 'Phone is required';
    
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.contact_email)) {
      newErrors.contact_email = 'Invalid email format';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      const data = new FormData();
      
      // Append text fields
      Object.keys(formData).forEach((key) => {
        if (formData[key]) {
          data.append(key, formData[key]);
        }
      });
      
      // Append images
      images.forEach((image) => {
        data.append('images', image);
      });
      
      // Append videos
      videos.forEach((video) => {
        data.append('videos', video);
      });
      
      await businessesAPI.create(data);
      
      alert('Business created successfully! It will be reviewed by an administrator.');
      navigate('/my-businesses');
    } catch (error) {
      console.error('Error creating business:', error);
      if (error.response?.data) {
        setErrors(error.response.data);
      } else {
        alert('Failed to create business. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ padding: '48px 0', maxWidth: '800px' }}>
      <div className="card">
        <div className="card-header">
          <h1>Create New Business</h1>
          <p className="text-muted">Fill in the details to list your business</p>
        </div>
        
        <form onSubmit={handleSubmit}>
          {/* Basic Information */}
          <div className="form-section">
            <h3>Basic Information</h3>
            
            <div className="form-group">
              <label htmlFor="name">Business Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                className={`form-control ${errors.name ? 'error' : ''}`}
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter business name"
                required
              />
              {errors.name && <span className="error-text">{errors.name}</span>}
            </div>
            
            <div className="form-group">
              <label htmlFor="description">Description *</label>
              <textarea
                id="description"
                name="description"
                className={`form-control ${errors.description ? 'error' : ''}`}
                value={formData.description}
                onChange={handleChange}
                rows="5"
                placeholder="Describe your business, products, or services"
                required
              />
              {errors.description && <span className="error-text">{errors.description}</span>}
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="category">Category</label>
                <select
                  id="category"
                  name="category"
                  className="form-control"
                  value={formData.category}
                  onChange={handleChange}
                  disabled={categoriesLoading}
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="price">Price ($)</label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  className="form-control"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                />
              </div>
            </div>
          </div>
          
          {/* Contact Information */}
          <div className="form-section">
            <h3>Contact Information</h3>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="contact_email">Email *</label>
                <input
                  type="email"
                  id="contact_email"
                  name="contact_email"
                  className={`form-control ${errors.contact_email ? 'error' : ''}`}
                  value={formData.contact_email}
                  onChange={handleChange}
                  placeholder="contact@business.com"
                  required
                />
                {errors.contact_email && <span className="error-text">{errors.contact_email}</span>}
              </div>
              
              <div className="form-group">
                <label htmlFor="contact_phone">Phone *</label>
                <input
                  type="tel"
                  id="contact_phone"
                  name="contact_phone"
                  className={`form-control ${errors.contact_phone ? 'error' : ''}`}
                  value={formData.contact_phone}
                  onChange={handleChange}
                  placeholder="+1 234 567 8900"
                  required
                />
                {errors.contact_phone && <span className="error-text">{errors.contact_phone}</span>}
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="address">Address</label>
              <textarea
                id="address"
                name="address"
                className="form-control"
                value={formData.address}
                onChange={handleChange}
                rows="2"
                placeholder="Business address"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="website">Website</label>
              <input
                type="url"
                id="website"
                name="website"
                className="form-control"
                value={formData.website}
                onChange={handleChange}
                placeholder="https://www.business.com"
              />
            </div>
          </div>
          
          {/* Media Upload */}
          <div className="form-section">
            <h3>Media</h3>
            
            <div className="form-group">
              <label htmlFor="images">Images</label>
              <input
                type="file"
                id="images"
                className="form-control"
                onChange={handleImageChange}
                accept="image/*"
                multiple
              />
              <small className="text-muted">Upload up to 10 images (JPG, PNG, GIF)</small>
              {images.length > 0 && (
                <div className="file-preview">
                  <p>{images.length} image(s) selected</p>
                  <div className="preview-grid">
                    {images.slice(0, 4).map((file, index) => (
                      <div className="preview key={index}-item">
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`Preview ${index + 1}`}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <div className="form-group">
              <label htmlFor="videos">Videos</label>
              <input
                type="file"
                id="videos"
                className="form-control"
                onChange={handleVideoChange}
                accept="video/*"
                multiple
              />
              <small className="text-muted">Upload videos (MP4, WEBM)</small>
              {videos.length > 0 && (
                <div className="file-preview">
                  <p>{videos.length} video(s) selected</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Submit Buttons */}
          <div className="form-actions">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Business'}
            </button>
            <Link to="/businesses" className="btn btn-outline">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateBusiness;
