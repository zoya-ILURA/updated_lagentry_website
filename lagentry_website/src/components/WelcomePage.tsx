import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimationShaderBackground } from './AnimationShaderBackground';
import ShaderCanvas from '../community/ShaderCanvas';
import './WelcomePage.css';

const WelcomePage: React.FC = () => {
  const navigate = useNavigate();
  const [shaderSize, setShaderSize] = useState(600);
  const [isIntroComplete, setIsIntroComplete] = useState(false);
  
  useEffect(() => {
    // Check if session has started (intro already shown or skipped)
    const hasSessionStarted = sessionStorage.getItem('lagentry-session-started');
    
    if (hasSessionStarted) {
      // Session already started - show WelcomePage immediately
      setIsIntroComplete(true);
    } else {
      // Wait for intro to complete - reduced wait time
      const timer = setTimeout(() => {
        setIsIntroComplete(true);
      }, 1000); // 1 second to allow slide-out animation
      
      return () => clearTimeout(timer);
    }
  }, []);
  
  useEffect(() => {
    const updateShaderSize = () => {
      const width = window.innerWidth;
      if (width <= 480) {
        setShaderSize(250);
      } else if (width <= 768) {
        setShaderSize(350);
      } else if (width <= 968) {
        setShaderSize(450);
      } else {
        setShaderSize(600);
      }
    };
    
    updateShaderSize();
    window.addEventListener('resize', updateShaderSize);
    return () => window.removeEventListener('resize', updateShaderSize);
  }, []);
  
  // Don't render WelcomePage content during intro animation - completely hide it
  if (!isIntroComplete) {
    return null;
  }
  
  return (
    <div className="welcome-container intro-complete" style={{ position: 'relative', zIndex: 1 }}>
      <AnimationShaderBackground />
      <div className="welcome-content">
        <div className="tagline-banner">
          <img 
            src="/images/nvidia-logo-png_seeklogo-101614.png" 
            alt="NVIDIA Logo" 
            className="nvidia-logo"
          />
          <span>Backed by NVIDIA.</span>
        </div>
        
        <h1 className="main-heading">
          <span className="heading-line1">Hire AI Employees</span>
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
          <button className="cta-button secondary-cta" onClick={() => navigate('/waitlist')}>
            Join the Waitlist
            <span className="arrow">→</span>
          </button>
        </div>
      </div>
      
      <div className="animation-space">
        {/* Shader reminder animation - Ether shader */}
        <div className="shader-reminder">
          <ShaderCanvas 
            size={shaderSize}
            shaderId={2}
          />
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;