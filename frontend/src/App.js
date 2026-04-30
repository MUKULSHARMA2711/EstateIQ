import React, { useState } from 'react';
import './App.css';
import PropertyForm from './components/PropertyForm';
import ResultsDisplay from './components/ResultsDisplay';
import { analyzeProperty } from './services/apiService';

function App() {
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFormSubmit = async (formData) => {
    setLoading(true);
    setError(null);
    setResults(null);

    try {
      const data = await analyzeProperty(formData);
      setResults(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResults(null);
    setError(null);
  };

  return (
    <div className="App">
      <header className="app-header">
        <div className="header-content">
          <h1>🏠 EstateIQ</h1>
          <p>AI-Powered Real Estate Investment Analysis</p>
        </div>
      </header>

      <main className="app-main">
        <div className="container">
          <div className="form-wrapper">
            <PropertyForm onSubmit={handleFormSubmit} loading={loading} />
          </div>

          {(results || error) && (
            <div className="results-wrapper">
              <ResultsDisplay results={results} error={error} />
              {results && (
                <button onClick={handleReset} className="reset-btn">
                  Analyze Another Property
                </button>
              )}
            </div>
          )}
        </div>
      </main>

      <footer className="app-footer">
        <p>
          EstateIQ © 2026 | Powered by Machine Learning & Django REST API
        </p>
      </footer>
    </div>
  );
}

export default App;
