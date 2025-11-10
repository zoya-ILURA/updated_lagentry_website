import React from 'react';
import './Dashboard.css';
import DashGif from '../Dash.gif';
import DashBg from '../Dash_bg.gif';

const Dashboard: React.FC = () => {
  return (
    <div className="dashboard-section">
      {/* Dashboard Content */}
      <div className="dashboard-container">
        <div className="dashboard-content">
          <div className="dashboard-header">
            <h2 className="dashboard-title">Agent Analytics Dashboard</h2>
            <p className="dashboard-subtitle">
              Real-time insights into your AI agent ecosystem
            </p>
          </div>

          {/* Dashboard GIF */}
          <div className="dashboard-gif-container">
            {/* Background GIF */}
            <img src={DashBg} alt="Dashboard Background" className="dashboard-bg-gif" />
            {/* Main Dashboard GIF */}
            <img src={DashGif} alt="Dashboard Analytics" className="dashboard-gif" />
          </div>

          {/* Exact copy: embed built stacked-slides-app */}
          <div className="embedded-slides">
            <div className="embedded-slides-frame-wrap">
              <iframe
                className="embedded-slides-frame"
                src={`${process.env.PUBLIC_URL}/videos/stacked-slides-app/index.html`}
                title="Stacked Slides"
                loading="eager"
                allow="autoplay; fullscreen"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};export default Dashboard;



