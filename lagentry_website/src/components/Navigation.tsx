import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Navigation.css';

const Navigation: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Show navigation after animation completes (8 seconds)
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 8000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const scrollToSection = (selector: string, maxRetries = 10, delay = 100) => {
    let retries = 0;
    const tryScroll = () => {
      const element = document.querySelector(selector);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      } else if (retries < maxRetries) {
        retries++;
        setTimeout(tryScroll, delay);
      }
    };
    tryScroll();
  };

  const handleAgentsClick = () => {
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => scrollToSection('.templates-section', 15, 150), 200);
    } else {
      scrollToSection('.templates-section');
    }
  };

  const handleFeaturesClick = () => {
    navigate('/features');
  };

  const handleContactClick = () => {
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => scrollToSection('.footer', 15, 150), 200);
    } else {
      scrollToSection('.footer');
    }
  };

  return (
    <nav className={`navigation ${isScrolled ? 'scrolled' : ''} ${isVisible ? 'visible' : ''}`}>
      <div className="nav-container">
                {/* Logo with purple hexagonal icon */}
          <div className="logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
                  <div className="logo-icon">
                    <img src="/images/logo.png" alt="Lagentry Logo" className="logo-icon-image" />
                  </div>
          </div>

          {/* Desktop Navigation Menu */}
          <div className="nav-menu desktop-menu">
          <div className="nav-item" onClick={handleAgentsClick} style={{ cursor: 'pointer' }}>Agents</div>
          <div className="nav-item" onClick={handleFeaturesClick} style={{ cursor: 'pointer' }}>Features</div>
          <div className="nav-item" onClick={() => navigate('/pricing')} style={{ cursor: 'pointer' }}>Pricing</div>
          <div className="nav-item" onClick={handleContactClick} style={{ cursor: 'pointer' }}>Contact Us</div>
        </div>

        {/* Desktop Right Side Button */}
        <div className="nav-actions desktop-actions">
          <button className="demo-button" onClick={() => navigate('/book-demo')}>
            Book a Demo
          </button>
        </div>

        {/* Mobile Hamburger Menu */}
        <div className="mobile-menu-toggle" onClick={toggleMobileMenu}>
          <div className={`hamburger ${isMobileMenuOpen ? 'active' : ''}`}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      <div className={`mobile-menu ${isMobileMenuOpen ? 'open' : ''}`}>
        <div className="mobile-menu-content">
          <div className="mobile-nav-item" onClick={() => { handleAgentsClick(); setIsMobileMenuOpen(false); }} style={{ cursor: 'pointer' }}>Agents</div>
          <div className="mobile-nav-item" onClick={() => { handleFeaturesClick(); setIsMobileMenuOpen(false); }} style={{ cursor: 'pointer' }}>Features</div>
          <div className="mobile-nav-item" onClick={() => { navigate('/pricing'); setIsMobileMenuOpen(false); }} style={{ cursor: 'pointer' }}>Pricing</div>
          <div className="mobile-nav-item" onClick={() => { handleContactClick(); setIsMobileMenuOpen(false); }} style={{ cursor: 'pointer' }}>Contact Us</div>
          <div className="mobile-nav-item">
            <button className="mobile-demo-button" onClick={() => { navigate('/book-demo'); setIsMobileMenuOpen(false); }}>
              Book a Demo
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;