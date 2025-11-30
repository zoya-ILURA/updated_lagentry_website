import React, { useEffect, useRef, useState } from 'react';
import './Header.css';
import lagentryImage from '../Lagentry-main.png';
import { ShaderBackground } from './ShaderBackground';

const Header: React.FC = () => {
  const [showText, setShowText] = useState(false);
  const [showCopyright, setShowCopyright] = useState(false);
  const [showLagentry, setShowLagentry] = useState(false);
  const [showNavigation, setShowNavigation] = useState(false);
  const [hideHeader, setHideHeader] = useState(false);
  const [shouldShowIntro, setShouldShowIntro] = useState(true);

  useEffect(() => {
    // Always show intro on page load (for now, can be controlled by sessionStorage later)
    // Uncomment the line below to enable sessionStorage check
    // const hasSessionStarted = sessionStorage.getItem('lagentry-session-started');
    const hasSessionStarted = false; // Always show intro for now
    
    if (!hasSessionStarted) {
      // Fresh page load - show intro
      setShouldShowIntro(true);
      
      // Mark session as started immediately
      sessionStorage.setItem('lagentry-session-started', 'true');
      
      // Animation sequence timing - smooth intro
      const timeline = [
        { delay: 200, action: () => {
          setShowText(true);
        }},
        { delay: 1000, action: () => {
          setShowCopyright(true);
        }},
        { delay: 3000, action: () => {
          // Hide text and copyright, show Lagentry
          setShowText(false);
          setShowCopyright(false);
          setShowLagentry(true);
        }},
        { delay: 5000, action: () => {
          // Slide out the intro
          setShowLagentry(false);
          setShowNavigation(true);
          setHideHeader(true);
        }}
      ];

      timeline.forEach(({ delay, action }) => {
        setTimeout(action, delay);
      });
    } else {
      // Already in session - hide immediately
      setHideHeader(true);
      setShouldShowIntro(false);
    }
  }, []);

  const bgRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = bgRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    el.style.setProperty('--mx', `${x}%`);
    el.style.setProperty('--my', `${y}%`);
    el.style.setProperty('--glowOpacity', '1');
  };

  const handleMouseLeave = () => {
    const el = bgRef.current;
    if (!el) return;
    el.style.setProperty('--glowOpacity', '0');
  };

  // Don't render if intro shouldn't show
  if (!shouldShowIntro && hideHeader) {
    return null;
  }

  return (
    <header className={`header ${hideHeader ? 'header-hidden' : ''} ${showLagentry ? 'lagentry-fullscreen' : ''}`}>
      <div
        ref={bgRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className={`header-background ${showLagentry ? 'gradient-active' : ''}`}
      >
        {/* Flowing Waves Background - always visible */}
        <ShaderBackground />
        
        {/* Sliding Text */}
        <div className={`sliding-text ${showText ? 'visible' : ''} ${!showText && showLagentry ? 'hidden' : ''}`}>
          <div className="sliding-text-content">
            <h2>Introducing AI Employees Built to Run SMEs.</h2>
          </div>
          {/* Diagonal glow line */}
          <div className={`diagonal-glow-line ${showText ? 'visible' : ''}`}></div>
        </div>
        
        {/* Copyright */}
        <div className={`copyright-text ${showCopyright ? 'visible' : ''} ${!showCopyright && showLagentry ? 'hidden' : ''}`}>
          <p>© 2024 Lagentry. All rights reserved.</p>
        </div>
        
        {/* Lagentry Image */}
        <div className={`background-lagentry-text ${showLagentry ? 'visible' : ''}`}>
          <img src={lagentryImage} alt="Lagentry" className="lagentry-image" />
        </div>
      </div>
    </header>
  );
};

export default Header;
