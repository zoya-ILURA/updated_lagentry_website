import React, { useState } from 'react';
import './GmailSection.css';
import GmailVideo from '../email.mp4';

const GmailSection: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);

  const handleVideoClick = () => {
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitMessage(null);

    try {
      setIsSubmitting(true);

      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result?.message || 'Failed to submit. Please try again.');
      }

      setSubmitMessage('Submitted successfully!');
      // Optionally close the form after a short delay
      setTimeout(() => {
        setShowForm(false);
        setEmail('');
        setName('');
        setSubmitMessage(null);
      }, 1200);
    } catch (err: any) {
      console.error('Contact submit error:', err);
      setSubmitMessage(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
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
              {submitMessage && (
                <div className="email-form-message">
                  {submitMessage}
                </div>
              )}
              <button type="submit" className="email-form-submit" disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default GmailSection;


