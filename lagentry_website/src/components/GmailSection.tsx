import React, { useState } from 'react';
import './GmailSection.css';
import GmailVideo from '../email.mp4';

const GmailSection: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');

  const handleVideoClick = () => {
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Submitted:', { name, email });
    // Close the form after submission
    setShowForm(false);
    setEmail('');
    setName('');
  };

  const handleClose = () => {
    setShowForm(false);
    setEmail('');
    setName('');
  };

  return (
    <section className="gmail-section">
      <div className="gmail-frame-wrap">
        <video 
          className="gmail-video" 
          src={GmailVideo} 
          autoPlay 
          muted 
          loop 
          playsInline 
          onClick={handleVideoClick}
        />
      </div>
      
      {showForm && (
        <div className="email-form-overlay">
          <div className="email-form-container">
            <button className="email-form-close" onClick={handleClose}>×</button>
            <form onSubmit={handleSubmit} className="email-form">
              <h3 className="email-form-title">Get in Touch</h3>
              <div className="email-form-field">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="Enter your name"
                />
              </div>
              <div className="email-form-field">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="Enter your email"
                />
              </div>
              <button type="submit" className="email-form-submit">Submit</button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default GmailSection;


