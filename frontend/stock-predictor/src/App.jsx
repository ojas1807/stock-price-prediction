import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import Dashboard from './components/Dashboard';
import Prediction from './components/Prediction';
import Analytics from './components/Analytics';

const App = () => {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>Stock Price Prediction</h1>
          <nav>
            <ul className="nav-links">
              <li><Link to="/">Dashboard</Link></li>
              <li><Link to="/prediction">Prediction</Link></li>
              <li><Link to="/analytics">Analytics</Link></li>
            </ul>
          </nav>
        </header>
        <main>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/prediction" element={<Prediction />} />
            <Route path="/analytics" element={<Analytics />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;