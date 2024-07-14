import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Doughnut, Line } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title } from 'chart.js';
import '../styles/Dashboard.css';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title);

const Dashboard = () => {
  const [statistics, setStatistics] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const response = await axios.get('http://localhost:5050/api/statistics');
        setStatistics(response.data);
        setError('');
      } catch (error) {
        console.error('Error fetching statistics:', error);
        setError('Failed to fetch statistics. Please try again.');
      }
    };

    fetchStatistics();
  }, []);

  if (error) {
    return (
      <div className="dashboard-container">
        <h2 className="dashboard-header">Dashboard</h2>
        <div className="dashboard-status">
          <p className="error-message">{error}</p>
        </div>
      </div>
    );
  }

  if (!statistics) {
    return (
      <div className="dashboard-container">
        <h2 className="dashboard-header">Dashboard</h2>
        <div className="loading">Loading...</div>
      </div>
    );
  }

  const doughnutData = {
    labels: ['Total Books', 'Active Users'],
    datasets: [
      {
        data: [statistics.totalBooks, statistics.activeUsers],
        backgroundColor: ['#36A2EB', '#FFCE56'],
        hoverBackgroundColor: ['#36A2EB', '#FFCE56'],
      },
    ],
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
      },
      title: {
        display: true,
        text: 'Library Overview',
        font: {
          size: 16,
        },
      },
    },
  };

  // Assuming you have monthly data for books added
  const lineData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Books Added',
        data: [12, 19, 3, 5, 2, 3],
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
    ],
  };

  const lineOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Books Added Over Time',
        font: {
          size: 16,
        },
      },
    },
  };

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-header">Dashboard</h2>
      <div className="dashboard-grid">
        <div className="chart-container doughnut-chart">
          <Doughnut data={doughnutData} options={doughnutOptions} />
        </div>
        <div className="chart-container line-chart">
          <Line data={lineData} options={lineOptions} />
        </div>
        <div className="stats-container">
          <h3>Quick Stats</h3>
          <div className="stat-item">
            <span className="stat-label">Total Books:</span>
            <span className="stat-value">{statistics.totalBooks}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Active Users:</span>
            <span className="stat-value">{statistics.activeUsers}</span>
          </div>
          {/* Add more quick stats here */}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;