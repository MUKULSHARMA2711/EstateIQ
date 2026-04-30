import React, { useState } from 'react';
import '../styles/PropertyForm.css';

const PropertyForm = ({ onSubmit, loading }) => {
  const cities = [
    'Ahmedabad', 'Amritsar', 'Bangalore', 'Bhilai', 'Bhopal', 'Bhubaneswar', 'Bilaspur', 'Chennai', 'Coimbatore', 'Cuttack',
    'Dehradun', 'Dhanbad', 'Durgapur', 'Dwarka', 'Ernakulam', 'Faridabad', 'Gurgaon', 'Guwahati', 'Gwalior', 'Haridwar',
    'Howrah', 'Hyderabad', 'Indore', 'Jaipur', 'Jalandhar', 'Jamshedpur', 'Jodhpur', 'Kanpur', 'Karimnagar', 'Kochi',
    'Kolkata', 'Kozhikode', 'Lucknow', 'Ludhiana', 'Madurai', 'Mangalore', 'Mumbai', 'Muzaffarpur', 'Mysore', 'Nagpur',
    'NewDelhi', 'Noida', 'Panipat', 'Patna', 'Pondicherry', 'Pune', 'Raipur', 'Ranchi', 'Rishikesh', 'Rohini',
    'Shimla', 'Thane', 'Trichy', 'Udaipur', 'Vadodara', 'Warangal'
  ];

  const propertyTypes = ['Flat', 'House', 'Villa'];

  const [formData, setFormData] = useState({
    bedrooms: 3,
    propertytype: 'Flat',
    city: 'Mumbai',
    sqft: 1500,
    annual_rent: 300000,
    expenses: 50000,
    loan_percentage: 5,
    loan_amount: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: (() => {
        if (name === 'loan_percentage') {
          return Math.min(10, Math.max(0, parseFloat(value) || 0));
        }

        if (name === 'loan_amount') {
          if (value === '') return '';
          return Math.max(0, parseFloat(value) || 0);
        }

        return value;
      })(),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="property-form">
      <div className="form-section">
        <h3>Property Details</h3>
        <div className="form-row">
          <div className="form-group">
            <label>BHK (Bedrooms)</label>
            <input
              type="number"
              name="bedrooms"
              min="1"
              max="10"
              value={formData.bedrooms}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Property Type</label>
            <select
              name="propertytype"
              value={formData.propertytype}
              onChange={handleChange}
              required
            >
              {propertyTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>City</label>
            <select
              name="city"
              value={formData.city}
              onChange={handleChange}
              required
            >
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Built Up Area (Sq Ft)</label>
            <input
              type="number"
              name="sqft"
              value={formData.sqft}
              onChange={handleChange}
              required
            />
          </div>
        </div>
      </div>

      <div className="form-section">
        <h3>Financial Information</h3>
        <div className="form-row">
          <div className="form-group">
            <label>
              Annual Rent (₹)
              <span className="tooltip-icon" title="How much rent you earn per year from this property">ℹ️</span>
            </label>
            <input
              type="number"
              name="annual_rent"
              value={formData.annual_rent}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>
              Annual Expenses (₹)
              <span className="tooltip-icon" title="Maintenance, property tax, insurance, and other annual costs">ℹ️</span>
            </label>
            <input
              type="number"
              name="expenses"
              value={formData.expenses}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>
              Loan Percentage (%)
              <span className="tooltip-icon" title="% of predicted price you will take as loan (0-10%)">ℹ️</span>
            </label>
            <div className="loan-input-wrapper">
              <input
                type="number"
                name="loan_percentage"
                min="0"
                max="10"
                step="0.5"
                value={formData.loan_percentage}
                onChange={handleChange}
                required
              />
              <span className="loan-unit">%</span>
            </div>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>
              Loan Amount (₹)
              <span className="tooltip-icon" title="Optional: if provided, it overrides loan percentage (capped at 10% of predicted price)">ℹ️</span>
            </label>
            <input
              type="number"
              name="loan_amount"
              min="0"
              step="1000"
              value={formData.loan_amount}
              onChange={handleChange}
              placeholder="Optional"
            />
          </div>
        </div>
      </div>

      <button type="submit" disabled={loading} className="submit-btn">
        {loading ? 'Analyzing...' : 'Analyze Property'}
      </button>
    </form>
  );
};

export default PropertyForm;
