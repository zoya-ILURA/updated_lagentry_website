import React, { useEffect, useRef, useState } from 'react';
import './Header.css';
import lagentryImage from '../Lagentry-main.png';
import { ShaderBackground } from './ShaderBackground';
import { hasIntroCompleted, markIntroCompleted } from '../introState';

const Header: React.FC = () => {
  // Only show the intro once per hard refresh.
  const [isActive, setIsActive] = useState(() => !hasIntroCompleted());
  const [showText, setShowText] = useState(false);
  const [showCopyright, setShowCopyright] = useState(false);
  const [showLagentry, setShowLagentry] = useState(false);
  const [showNavigation, setShowNavigation] = useState(false);
  const [hideHeader, setHideHeader] = useState(false);
  const [shouldShowIntro, setShouldShowIntro] = useState(isActive);

  useEffect(() => {
    if (!isActive) return;
    
    // Fresh page load: play the intro once, then mark it as completed
    // and deactivate this header so it unmounts.
      setShouldShowIntro(true);
      
      const timeline = [
      {
        delay: 200,
        action: () => {
          setShowText(true);
        },
      },
      {
        delay: 1000,
        action: () => {
          setShowCopyright(true);
        },
      },
      {
        delay: 3000,
        action: () => {
          setShowText(false);
          setShowCopyright(false);
          setShowLagentry(true);
        },
      },
      {
        delay: 5000,
        action: () => {
          setShowLagentry(false);
          setShowNavigation(true);
          setHideHeader(true);
          markIntroCompleted();
          setShouldShowIntro(false);
          setIsActive(false);
        },
      },
      ];

    const timers: number[] = [];
      timeline.forEach(({ delay, action }) => {
      const id = window.setTimeout(action, delay);
      timers.push(id);
    });

    return () => {
      timers.forEach((id) => window.clearTimeout(id));
    };
  }, [isActive]);

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

  // If intro is no longer active (already played this load), render nothing.
  if (!isActive) {
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
          <p>© 2025 Lagentry. All rights reserved.</p>
        </div>
        
        {/* Lagentry Year + Logo */}
        <div className={`background-lagentry-text ${showLagentry ? 'visible' : ''}`}>
          <span className="lagentry-year">2025</span>
          <img src={lagentryImage} alt="LAGENTRY logo" className="lagentry-image" />
        </div>
      </div>
    </header>
  );
};

export default Header;
