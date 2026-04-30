import React from 'react';
import '../styles/ResultsDisplay.css';

const ResultsDisplay = ({ results, error }) => {
  if (!results && !error) {
    return null;
  }

  if (error) {
    return (
      <div className="results-container error">
        <h2>❌ Error</h2>
        <p className="error-message">{error}</p>
      </div>
    );
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'Low':
        return '#4CAF50'; // Green
      case 'Medium':
        return '#FF9800'; // Orange
      case 'High':
        return '#f44336'; // Red
      default:
        return '#666';
    }
  };

  const getRecommendationColor = (status) => {
    switch (status) {
      case 'BUY':
        return '#4CAF50';
      case 'CONSIDER':
        return '#2196F3';
      case 'HOLD':
        return '#FF9800';
      case 'AVOID':
        return '#f44336';
      default:
        return '#666';
    }
  };

  return (
    <div className="results-container success">
      <h2>📊 Analysis Results</h2>

      <div className="results-grid">
        <div className="result-card price">
          <h3>💰 Predicted Price</h3>
          <p className="result-value">
            {formatCurrency(results.predicted_price)}
          </p>
        </div>

        <div className="result-card income">
          <h3>💵 Net Annual Income</h3>
          <p className="result-value">
            {formatCurrency(results.net_income)}
          </p>
        </div>

        <div className="result-card roi">
          <h3>📈 ROI</h3>
          <p className="result-value">{results.roi.toFixed(2)}%</p>
        </div>

        {results.irr !== undefined && (
          <div className="result-card irr">
            <h3>📊 IRR</h3>
            <p className="result-value">
              {results.irr ? `${results.irr.toFixed(2)}%` : 'N/A'}
            </p>
          </div>
        )}

        <div className="result-card" style={{ borderLeftColor: getRiskColor(results.risk) }}>
          <h3>⚠️ Risk Level</h3>
          <p className="result-value risk" style={{ color: getRiskColor(results.risk) }}>
            {results.risk}
          </p>
        </div>

        {results.recommendation && (
          <div
            className="result-card recommendation"
            style={{ borderLeftColor: getRecommendationColor(results.recommendation.status) }}
          >
            <h3>🎯 Recommendation</h3>
            <p className="result-value rec" style={{ color: getRecommendationColor(results.recommendation.status) }}>
              {results.recommendation.status}
            </p>
          </div>
        )}
      </div>

      <div className="analysis-summary">
        <h3>📈 Investment Metrics</h3>
        <ul>
          <li>
            Predicted Property Value: <strong>{formatCurrency(results.predicted_price)}</strong>
          </li>
          <li>
            Annual Net Income: <strong>{formatCurrency(results.net_income)}</strong>
          </li>
          <li>
            Return on Investment (ROI): <strong>{results.roi.toFixed(2)}%</strong>
          </li>
          {results.irr !== undefined && (
            <li>
              Internal Rate of Return (IRR): <strong>{results.irr ? `${results.irr.toFixed(2)}%` : 'N/A'}</strong>
            </li>
          )}
          <li>
            Risk Assessment: <strong style={{ color: getRiskColor(results.risk) }}>
              {results.risk}
            </strong>
          </li>
        </ul>
      </div>

      {results.recommendation && (
        <div className="recommendation-section">
          <h3>🎯 Investment Decision</h3>
          <div
            className="recommendation-card"
            style={{ borderLeftColor: getRecommendationColor(results.recommendation.status) }}
          >
            <div className="rec-status" style={{ color: getRecommendationColor(results.recommendation.status) }}>
              {results.recommendation.status}
            </div>
            <div className="rec-rating">
              Rating: <strong>{results.recommendation.rating}/10</strong>
            </div>
            <div className="rec-action">
              <strong>Action:</strong> {results.recommendation.action}
            </div>
            <div className="rec-reasoning">
              <strong>Analysis:</strong>
              <ul>
                {results.recommendation.reasoning.map((reason, idx) => (
                  <li key={idx}>{reason}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultsDisplay;
