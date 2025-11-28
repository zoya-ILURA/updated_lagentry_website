import React, { useEffect, useRef, useState } from "react";
import "./Header.css";
import lagentryImage from "../Lagentry-main.png";
import { ShaderBackground } from "./ShaderBackground";

const Header: React.FC = () => {
  const [showText, setShowText] = useState(false);
  const [showCopyright, setShowCopyright] = useState(false);
  const [showLagentry, setShowLagentry] = useState(false);
  const [hideHeader, setHideHeader] = useState(false);

  useEffect(() => {
    const timeline = [
      {
        delay: 1500,
        action: () => setShowText(true),
      },
      {
        delay: 3000,
        action: () => setShowCopyright(true),
      },
      {
        delay: 4500,
        action: () => {
          setShowText(false);
          setShowCopyright(false);
          setShowLagentry(true);
        },
      },
      {
        delay: 8000,
        action: () => {
          setShowLagentry(false);
          setHideHeader(true);
        },
      },
    ];

    const timers = timeline.map(({ delay, action }) =>
      window.setTimeout(action, delay)
    );

    return () => {
      timers.forEach((id) => window.clearTimeout(id));
    };
  }, []);

  const bgRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = bgRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    el.style.setProperty("--mx", `${x}%`);
    el.style.setProperty("--my", `${y}%`);
    el.style.setProperty("--glowOpacity", "1");
  };

  const handleMouseLeave = () => {
    const el = bgRef.current;
    if (!el) return;
    el.style.setProperty("--glowOpacity", "0");
  };

  return (
    <header
      className={`header ${hideHeader ? "header-hidden" : ""} ${
        showLagentry ? "lagentry-fullscreen" : ""
      }`}
    >
      <div
        ref={bgRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className={`header-background ${showLagentry ? "gradient-active" : ""}`}
      >
        <ShaderBackground />

        <div
          className={`sliding-text ${showText ? "visible" : ""} ${
            !showText && showLagentry ? "hidden" : ""
          }`}
        >
          <div className="sliding-text-content">
            <img
              src="/images/logo.png"
              alt="Lagentry Logo"
              className="header-logo-icon-intro"
            />
            <h2>Introducing The only AI Agents You Need, To Automate Your Entire Business.</h2>
          </div>
          <div
            className={`diagonal-glow-line ${showText ? "visible" : ""}`}
          ></div>
        </div>

        <div
          className={`copyright-text ${
            showCopyright ? "visible" : ""
          } ${!showCopyright && showLagentry ? "hidden" : ""}`}
        >
          <p>© 2024 Lagentry. All rights reserved.</p>
        </div>

        <div
          className={`background-lagentry-text ${
            showLagentry ? "visible" : ""
          }`}
        >
          <img src={lagentryImage} alt="Lagentry" className="lagentry-image" />
        </div>
      </div>
    </header>
  );
};

export default Header;
