import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Navigation.css';

const Navigation: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isAgentsOpen, setIsAgentsOpen] = useState(false);
  const agentsHoverTimeoutRef = useRef<number | null>(null);
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
    navigate('/agents');
  };

  const handleAgentsMouseEnter = () => {
    if (agentsHoverTimeoutRef.current) {
      window.clearTimeout(agentsHoverTimeoutRef.current);
      agentsHoverTimeoutRef.current = null;
    }
    setIsAgentsOpen(true);
  };

  const handleAgentsMouseLeave = () => {
    // Small delay so the menu doesn't close the instant the cursor hits the gap
    agentsHoverTimeoutRef.current = window.setTimeout(() => {
      setIsAgentsOpen(false);
      agentsHoverTimeoutRef.current = null;
    }, 120);
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
          <div
            className="nav-item nav-item-agents"
            onClick={handleAgentsClick}
            style={{ cursor: 'pointer', position: 'relative' }}
            onMouseEnter={handleAgentsMouseEnter}
            onMouseLeave={handleAgentsMouseLeave}
          >
            <span>Agents</span>
            <div className={`agents-dropdown ${isAgentsOpen ? 'open' : ''}`}>
              <button type="button" onClick={() => navigate('/agents/gtm-sales')}>
                <div className="agents-dropdown-pill">
                  <div className="agents-dropdown-blob agents-blob-sales" />
                  <div className="agents-dropdown-copy">
                    <span className="agents-dropdown-title">GTM &amp; Sales Agent</span>
                    <span className="agents-dropdown-subtitle">
                      Drive outreach, qualify intent, and keep deals in motion.
                    </span>
                  </div>
                </div>
              </button>
              <button type="button" onClick={() => navigate('/agents/hr-recruitment')}>
                <div className="agents-dropdown-pill">
                  <div className="agents-dropdown-blob agents-blob-hr" />
                  <div className="agents-dropdown-copy">
                    <span className="agents-dropdown-title">HR &amp; Recruitment</span>
                    <span className="agents-dropdown-subtitle">
                      Orchestrate hiring, onboarding, and people ops flows.
                    </span>
                  </div>
                </div>
              </button>
              <button type="button" onClick={() => navigate('/agents/cfo-finance')}>
                <div className="agents-dropdown-pill">
                  <div className="agents-dropdown-blob agents-blob-cfo" />
                  <div className="agents-dropdown-copy">
                    <span className="agents-dropdown-title">CFO &amp; Finance</span>
                    <span className="agents-dropdown-subtitle">
                      See cash, margin, and risk in one focused lane.
                    </span>
                  </div>
                </div>
              </button>
              <button type="button" onClick={() => navigate('/agents/customer-support')}>
                <div className="agents-dropdown-pill">
                  <div className="agents-dropdown-blob agents-blob-support" />
                  <div className="agents-dropdown-copy">
                    <span className="agents-dropdown-title">Customer Support</span>
                    <span className="agents-dropdown-subtitle">
                      Always-on help that feeds product with real signals.
                    </span>
                  </div>
                </div>
              </button>
              <button type="button" onClick={() => navigate('/agents/real-estate')}>
                <div className="agents-dropdown-pill">
                  <div className="agents-dropdown-blob agents-blob-realestate" />
                  <div className="agents-dropdown-copy">
                    <span className="agents-dropdown-title">Real Estate &amp; Property</span>
                    <span className="agents-dropdown-subtitle">
                      From leads to leases and maintenance, handled quietly.
                    </span>
                  </div>
                </div>
              </button>
              <button type="button" onClick={() => navigate('/agents/healthcare')}>
                <div className="agents-dropdown-pill">
                  <div className="agents-dropdown-blob agents-blob-healthcare" />
                  <div className="agents-dropdown-copy">
                    <span className="agents-dropdown-title">Healthcare</span>
                    <span className="agents-dropdown-subtitle">
                      Coordinate intake, scheduling, and follow‑ups with care.
                    </span>
                  </div>
                </div>
              </button>
            </div>
          </div>
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