import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';

const Analytics = () => {
  const [modelPerformance, setModelPerformance] = useState(null);
  const [featureImportance, setFeatureImportance] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const performanceResponse = await axios.get('http://localhost:5000/api/model-performance');
        const importanceResponse = await axios.get('http://localhost:5000/api/feature-importance');
        
        setModelPerformance(performanceResponse.data);
        setFeatureImportance(importanceResponse.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching analytics data:', error);
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  const performanceData = {
    labels: modelPerformance ? Object.keys(modelPerformance) : [],
    datasets: [
      {
        label: 'Model R² Score',
        data: modelPerformance ? Object.values(modelPerformance).map(model => model.r2_score) : [],
        backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(153, 102, 255, 0.6)'],
        borderColor: ['rgb(75, 192, 192)', 'rgb(153, 102, 255)'],
        borderWidth: 1,
      },
    ],
  };

  const importanceData = {
    labels: featureImportance ? featureImportance.features : [],
    datasets: [
      {
        label: 'Feature Importance (Random Forest)',
        data: featureImportance ? featureImportance.importance : [],
        backgroundColor: 'rgba(255, 159, 64, 0.6)',
        borderColor: 'rgb(255, 159, 64)',
        borderWidth: 1,
      },
    ],
  };

  if (loading) {
    return <div className="loading">Loading analytics data...</div>;
  }

  return (
    <div className="analytics">
      <h2>Model Analytics</h2>
      
      <div className="analytics-container">
        <div className="chart-container">
          <h3>Model Performance</h3>
          <Bar 
            data={performanceData} 
            options={{
              scales: {
                y: {
                  beginAtZero: true,
                  max: 1,
                  title: {
                    display: true,
                    text: 'R² Score'
                  }
                }
              },
              plugins: {
                title: {
                  display: true,
                  text: 'Model Performance Comparison'
                }
              }
            }} 
          />
          <div className="metrics-container">
            {modelPerformance && Object.entries(modelPerformance).map(([model, metrics]) => (
              <div key={model} className="metric-card">
                <h4>{model === 'linear' ? 'Linear Regression' : 'Random Forest'}</h4>
                <p>R² Score: {metrics.r2_score.toFixed(4)}</p>
                <p>MSE: {metrics.mse.toFixed(4)}</p>
                <p>MAE: {metrics.mae.toFixed(4)}</p>
              </div>
            ))}
          </div>
        </div>
        
        <div className="chart-container">
          <h3>Feature Importance</h3>
          <Bar 
            data={importanceData}
            options={{
              indexAxis: 'y',
              plugins: {
                title: {
                  display: true,
                  text: 'Random Forest Feature Importance'
                }
              }
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Analytics;