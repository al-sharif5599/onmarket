import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { businessesAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const BusinessDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeImage, setActiveImage] = useState(0);
  const [reviewData, setReviewData] = useState({ rating: 5, comment: '' });
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    fetchBusiness();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchBusiness = async () => {
    try {
      const response = await businessesAPI.getById(id);
      setBusiness(response.data);
    } catch (error) {
      setError('Failed to load business details');
      console.error('Error fetching business:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setSubmittingReview(true);
    try {
      await businessesAPI.addReview(id, reviewData);
      setReviewData({ rating: 5, comment: '' });
      fetchBusiness(); // Refresh to show new review
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  const isOwner = user && business && user.id === business.owner?.id;

  if (loading) {
    return (
      <div className="container" style={{ padding: '48px 0' }}>
        <div className="loading-container">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  if (error || !business) {
    return (
      <div className="container" style={{ padding: '48px 0' }}>
        <div className="alert alert-error">{error || 'Business not found'}</div>
        <Link to="/businesses" className="btn btn-outline mt-3">Back to Businesses</Link>
      </div>
    );
  }

  const allImages = business.images?.map(img => img.image_url) || [];
  if (business.primary_image && !allImages.includes(business.primary_image)) {
    allImages.unshift(business.primary_image);
  }

  return (
    <div className="container" style={{ padding: '48px 0' }}>
      <Link to="/businesses" className="btn btn-outline mb-3">← Back to Businesses</Link>
      
      <div className="business-detail-grid">
        {/* Image Gallery */}
        <div className="business-gallery">
          {allImages.length > 0 ? (
            <>
              <div className="main-image-container">
                <img
                  src={allImages[activeImage]}
                  alt={business.name}
                  className="main-image"
                />
              </div>
              {allImages.length > 1 && (
                <div className="thumbnail-grid">
                  {allImages.map((img, index) => (
                    <img
                      key={index}
                      src={img}
                      alt={`${business.name} ${index + 1}`}
                      className={`thumbnail ${activeImage === index ? 'active' : ''}`}
                      onClick={() => setActiveImage(index)}
                    />
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="no-image-placeholder">
              <span>No Images Available</span>
            </div>
          )}
        </div>

        {/* Business Info */}
        <div className="business-info">
          {business.category && (
            <span className="badge badge-primary">{business.category.name}</span>
          )}
          
          <h1 style={{ marginTop: '16px' }}>{business.name}</h1>
          
          <div className="business-meta-row">
            {business.price && (
              <span className="price">${business.price}</span>
            )}
            <span className="rating">
              ⭐ {business.average_rating?.toFixed(1) || '0.0'} 
              ({business.reviews?.length || 0} reviews)
            </span>
            <span className="views">👁 {business.views} views</span>
          </div>

          {business.status !== 'approved' && (
            <div className="alert alert-warning">
              This business is currently {business.status}
            </div>
          )}

          <div className="section">
            <h3>Description</h3>
            <p>{business.description}</p>
          </div>

          <div className="section">
            <h3>Contact Information</h3>
            <div className="contact-info">
              <p><strong>Email:</strong> {business.contact_email}</p>
              <p><strong>Phone:</strong> {business.contact_phone}</p>
              {business.address && <p><strong>Address:</strong> {business.address}</p>}
              {business.website && (
                <p><strong>Website:</strong> 
                  <a href={business.website} target="_blank" rel="noopener noreferrer">
                    {business.website}
                  </a>
                </p>
              )}
            </div>
          </div>

          {business.owner && (
            <div className="section">
              <h3>Listed By</h3>
              <p>{business.owner.username}</p>
            </div>
          )}

          {/* Videos */}
          {business.videos && business.videos.length > 0 && (
            <div className="section">
              <h3>Videos</h3>
              <div className="video-grid">
                {business.videos.map((video) => (
                  <video
                    key={video.id}
                    controls
                    className="video-player"
                    poster={video.thumbnail_url}
                  >
                    <source src={video.video_url} type="video/mp4" />
                    Your browser does not support video playback.
                  </video>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Reviews Section */}
      <div className="reviews-section">
        <h2>Reviews</h2>
        
        {/* Add Review Form */}
        {user && !isOwner && (
          <form onSubmit={handleReviewSubmit} className="review-form">
            <h3>Write a Review</h3>
            <div className="form-group">
              <label>Rating</label>
              <select
                value={reviewData.rating}
                onChange={(e) => setReviewData({ ...reviewData, rating: parseInt(e.target.value) })}
                className="form-control"
              >
                {[1, 2, 3, 4, 5].map((num) => (
                  <option key={num} value={num}>{num} ⭐</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Comment</label>
              <textarea
                value={reviewData.comment}
                onChange={(e) => setReviewData({ ...reviewData, comment: e.target.value })}
                className="form-control"
                rows="4"
                placeholder="Share your experience..."
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={submittingReview}
            >
              {submittingReview ? 'Submitting...' : 'Submit Review'}
            </button>
          </form>
        )}

        {/* Reviews List */}
        <div className="reviews-list">
          {business.reviews && business.reviews.length > 0 ? (
            business.reviews.map((review) => (
              <div key={review.id} className="review-card">
                <div className="review-header">
                  <strong>{review.user?.username || 'Anonymous'}</strong>
                  <span className="review-rating">{'⭐'.repeat(review.rating)}</span>
                </div>
                <p className="review-comment">{review.comment}</p>
                <span className="review-date">
                  {new Date(review.created_at).toLocaleDateString()}
                </span>
              </div>
            ))
          ) : (
            <p className="text-muted">No reviews yet. Be the first to review!</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default BusinessDetail;
