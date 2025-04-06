const express = require('express');
const cors = require('cors');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// ML API endpoint (your FastAPI service)
const ML_API_URL = 'http://localhost:8000';

// Route to fetch stock data
app.get('/api/stock-data', (req, res) => {
  const results = [];
  
  fs.createReadStream(path.join(__dirname, 'data', 'stock_data.csv'))
    .pipe(csv())
    .on('data', (data) => {
      // Convert string values to numbers
      const row = {};
      for (const [key, value] of Object.entries(data)) {
        if (key === 'Date') {
          row[key] = value;
        } else {
          row[key] = parseFloat(value);
        }
      }
      results.push(row);
    })
    .on('end', () => {
      res.json(results);
    })
    .on('error', (error) => {
      console.error('Error reading CSV:', error);
      res.status(500).json({ error: 'Failed to read stock data' });
    });
});

// Route to make predictions
app.post('/api/predict', async (req, res) => {
  try {
    const { model_type, features } = req.body;
    
    // Validate inputs
    if (!model_type || !features || !Array.isArray(features) || features.length !== 5) {
      return res.status(400).json({ 
        error: 'Invalid input. Required: model_type (string) and features (array of 5 numbers)'
      });
    }
    
    // Make request to ML API
    const response = await axios.post(`${ML_API_URL}/predict`, {
      model_type,
      features
    });
    
    res.json(response.data);
  } catch (error) {
    console.error('Error making prediction:', error);
    res.status(500).json({ error: 'Failed to get prediction' });
  }
});

// Route for model performance metrics
app.get('/api/model-performance', (req, res) => {
  // In a real application, this would come from your model evaluation
  // For now, we'll return sample data
  res.json({
    linear: {
      r2_score: 0.78,
      mse: 1254.32,
      mae: 26.54
    },
    random_forest: {
      r2_score: 0.86,
      mse: 873.21,
      mae: 19.35
    }
  });
});

// Route for feature importance
app.get('/api/feature-importance', (req, res) => {
  // In a real application, this would come from your model evaluation
  // For now, we'll return sample data
  res.json({
    features: ['Open', 'High', 'Low', 'Volume', 'Moving_Avg_10'],
    importance: [0.15, 0.28, 0.18, 0.09, 0.30]
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});