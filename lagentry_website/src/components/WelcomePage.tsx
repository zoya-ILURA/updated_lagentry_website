import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShaderCanvas } from './ShaderCanvas';
import './WelcomePage.css';

const WelcomePage: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="welcome-container">
      <div className="welcome-content">
        <div className="tagline-banner">
          <span>Backed by NVIDIA.</span>
        </div>
        
        <h1 className="main-heading">
          <span className="heading-line1">Create AI Agents</span>
        </h1>
        
        <div className="animated-text-container">
          <div className="animated-text-line">
            <span className="animated-text-item">With multi lingual support</span>
            <span className="animated-text-item">In Minutes</span>
            <span className="animated-text-item">With just prompts</span>
            <span className="animated-text-item">That scales</span>
            <span className="animated-text-item">With 100+ connectors</span>
          </div>
        </div>
        
        <p className="description-text">
          Vibe with your ideas. Just describe what you want in plain English — and watch your AI agent come to life instantly.
        </p>
        
        <div className="cta-section">
          <button className="cta-button" onClick={() => navigate('/waitlist')}>
            Join the Waitlist
            <span className="arrow">→</span>
          </button>
        </div>
      </div>
      
              <div className="animation-space">
                {/* Shader reminder animation - Ether shader */}
                <ShaderCanvas 
                  size={600}
                  shaderId={2}
                  className="shader-reminder"
                />
              </div>
    </div>
  );
};

export default WelcomePage;