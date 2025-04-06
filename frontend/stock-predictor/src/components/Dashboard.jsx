import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

const Dashboard = () => {
  const [stockData, setStockData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/stock-data');
        setStockData(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching stock data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const chartData = {
    labels: stockData.map(item => item.Date),
    datasets: [
      {
        label: 'Close Price',
        data: stockData.map(item => item.Close),
        fill: false,
        backgroundColor: 'rgb(75, 192, 192)',
        borderColor: 'rgba(75, 192, 192, 0.8)',
      },
      {
        label: '10-Day Moving Average',
        data: stockData.map(item => item.Moving_Avg_10),
        fill: false,
        backgroundColor: 'rgb(255, 99, 132)',
        borderColor: 'rgba(255, 99, 132, 0.8)',
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Stock Price History',
      },
    },
    scales: {
      y: {
        beginAtZero: false,
      },
    },
  };

  if (loading) {
    return <div className="loading">Loading dashboard data...</div>;
  }

  return (
    <div className="dashboard">
      <h2>Stock Price Dashboard</h2>
      <div className="chart-container">
        <Line data={chartData} options={options} />
      </div>
      <div className="stats-container">
        <div className="stat-card">
          <h3>Latest Close</h3>
          <p className="stat-value">₹{stockData.length > 0 ? stockData[stockData.length - 1].Close.toFixed(2) : 'N/A'}</p>
        </div>
        <div className="stat-card">
          <h3>Highest Price</h3>
          <p className="stat-value">₹{stockData.length > 0 ? Math.max(...stockData.map(item => item.High)).toFixed(2) : 'N/A'}</p>
        </div>
        <div className="stat-card">
          <h3>Lowest Price</h3>
          <p className="stat-value">₹{stockData.length > 0 ? Math.min(...stockData.map(item => item.Low)).toFixed(2) : 'N/A'}</p>
        </div>
        <div className="stat-card">
          <h3>Average Volume</h3>
          <p className="stat-value">{stockData.length > 0 ? Math.round(stockData.reduce((sum, item) => sum + item.Volume, 0) / stockData.length) : 'N/A'}</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;