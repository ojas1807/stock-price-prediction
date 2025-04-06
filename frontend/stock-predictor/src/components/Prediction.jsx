import React, { useState } from 'react';
import axios from 'axios';

const Prediction = () => {
  const [formData, setFormData] = useState({
    model_type: 'linear',
    open: '',
    high: '',
    low: '',
    volume: '',
    moving_avg: '',
  });
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // Convert string inputs to numbers
      const features = [
        parseFloat(formData.open),
        parseFloat(formData.high),
        parseFloat(formData.low),
        parseFloat(formData.volume),
        parseFloat(formData.moving_avg)
      ];
      
      const response = await axios.post('http://localhost:5000/api/predict', {
        model_type: formData.model_type,
        features: features
      });
      
      setPrediction(response.data.predicted_price);
    } catch (error) {
      console.error('Error making prediction:', error);
      setError('Failed to get prediction. Please check your inputs and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="prediction">
      <h2>Stock Price Prediction</h2>
      <div className="prediction-container">
        <form onSubmit={handleSubmit} className="prediction-form">
          <div className="form-group">
            <label htmlFor="model_type">Model Type:</label>
            <select 
              id="model_type" 
              name="model_type" 
              value={formData.model_type} 
              onChange={handleChange}
            >
              <option value="linear">Linear Regression</option>
              <option value="random_forest">Random Forest</option>
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="open">Open Price:</label>
            <input 
              type="number" 
              id="open" 
              name="open" 
              value={formData.open} 
              onChange={handleChange} 
              required 
              step="0.01"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="high">High Price:</label>
            <input 
              type="number" 
              id="high" 
              name="high" 
              value={formData.high} 
              onChange={handleChange} 
              required 
              step="0.01"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="low">Low Price:</label>
            <input 
              type="number" 
              id="low" 
              name="low" 
              value={formData.low} 
              onChange={handleChange} 
              required 
              step="0.01"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="volume">Volume:</label>
            <input 
              type="number" 
              id="volume" 
              name="volume" 
              value={formData.volume} 
              onChange={handleChange} 
              required 
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="moving_avg">10-Day Moving Average:</label>
            <input 
              type="number" 
              id="moving_avg" 
              name="moving_avg" 
              value={formData.moving_avg} 
              onChange={handleChange} 
              required 
              step="0.01"
            />
          </div>
          
          <button type="submit" className="btn-predict" disabled={loading}>
            {loading ? 'Predicting...' : 'Predict'}
          </button>
        </form>
        
        <div className="prediction-result">
          {error && <p className="error-message">{error}</p>}
          {prediction !== null && !error && (
            <div className="result-card">
              <h3>Predicted Close Price:</h3>
              <p className="prediction-value">₹{prediction.toFixed(2)}</p>
              <p className="model-info">Model: {formData.model_type === 'linear' ? 'Linear Regression' : 'Random Forest'}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Prediction;