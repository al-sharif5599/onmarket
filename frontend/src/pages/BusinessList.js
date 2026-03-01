import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { businessesAPI, categoriesAPI } from '../services/api';

const BusinessList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [businesses, setBusinesses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
  });

  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
  });

  useEffect(() => {
    fetchBusinesses();
    fetchCategories();
  }, [pagination.page, filters]);

  const fetchBusinesses = async () => {
    setLoading(true);
    try {
      const response = await businessesAPI.getAll({
        page: pagination.page,
        search: filters.search,
        category: filters.category,
      });
      setBusinesses(response.data.results || response.data);
      if (response.data.total_pages) {
        setPagination(prev => ({ ...prev, totalPages: response.data.total_pages }));
      }
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

  const handleSearch = (e) => {
    e.preventDefault();
    setPagination(prev => ({ ...prev, page: 1 }));
    fetchBusinesses();
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination(prev => ({ ...prev, page: newPage }));
    }
  };

  return (
    <div className="container" style={{ padding: '40px 20px' }}>
      {/* Header */}
      <div className="d-flex justify-between align-center mb-4">
        <h1>All Businesses</h1>
        <Link to="/create-business" className="btn btn-primary">
          Post Your Business
        </Link>
      </div>

      {/* Filters */}
      <div className="card mb-4">
        <div className="card-body">
          <form onSubmit={handleSearch} className="d-flex gap-2">
            <input
              type="text"
              className="form-control"
              placeholder="Search businesses..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
            />
            <select
              className="form-control"
              style={{ width: '200px' }}
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
            <button type="submit" className="btn btn-primary">
              Search
            </button>
          </form>
        </div>
      </div>

      {/* Results */}
      {loading ? (
        <div className="loading-container">
          <div className="spinner"></div>
        </div>
      ) : businesses.length === 0 ? (
        <div className="card text-center p-5">
          <h3>No businesses found</h3>
          <p className="text-muted">Try adjusting your search or filters</p>
        </div>
      ) : (
        <>
          <div className="grid grid-3">
            {businesses.map((business) => (
              <Link
                key={business.id}
                to={`/businesses/${business.id}`}
                className="business-card"
              >
                {business.primary_image ? (
                  <img
                    src={business.primary_image}
                    alt={business.name}
                    className="business-image"
                  />
                ) : (
                  <div className="business-image" style={{ 
                    background: '#e2e8f0', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center' 
                  }}>
                    <span className="text-muted">No Image</span>
                  </div>
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
                    <span>View Details →</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="pagination">
              <button
                className={`pagination-item ${pagination.page === 1 ? 'disabled' : ''}`}
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
              >
                ←
              </button>
              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  className={`pagination-item ${pagination.page === page ? 'active' : ''}`}
                  onClick={() => handlePageChange(page)}
                >
                  {page}
                </button>
              ))}
              <button
                className={`pagination-item ${pagination.page === pagination.totalPages ? 'disabled' : ''}`}
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.totalPages}
              >
                →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default BusinessList;
