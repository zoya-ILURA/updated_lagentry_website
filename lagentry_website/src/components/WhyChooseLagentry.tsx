import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './WhyChooseLagentry.css';

interface Agent {
  id: string;
  title: string;
  description: string;
  tags: string[];
  icon: string;
  voiceId: string;
  prompt: string;
}

const agents: Agent[] = [
  {
    id: 'lead-qualification',
    title: 'Lead Qualification • Buyer',
    description: 'Real-Time Booking #Lead Qualification',
    tags: ['Real-Time Booking', 'Lead Qualification'],
    icon: '📊',
    voiceId: 'jqcCZkN6Knx8BJ5TBdYR',
    prompt: `You are a professional Lead Qualification agent for Lagentry, an AI automation platform. Your role is to qualify potential customers and understand their business needs. 

Key information about Lagentry:
- We provide AI employees/agents for various business functions
- No-code platform for building AI agents
- Voice-capable agents with natural conversation
- Integrations with 1000+ platforms
- Multilingual support (English, Arabic, Hindi, Urdu, French, Tagalog)
- Pricing starts at $20/month for Hobby plan

Your conversation goals:
1. Greet the user warmly using their name
2. Ask about their business and current challenges
3. Identify pain points where AI agents could help
4. Qualify their budget and timeline
5. Recommend appropriate Lagentry solutions
6. Offer to book a demo or connect with sales team

Be conversational, helpful, and focus on understanding their specific needs. Ask follow-up questions to better qualify the lead.`
  },
  {
    id: 'customer-support',
    title: 'Customer Support • Restaurant',
    description: 'Real-Time Booking #Receptionist',
    tags: ['Real-Time Booking', 'Receptionist'],
    icon: '🍽️',
    voiceId: 'jqcCZkN6Knx8BJ5TBdYR',
    prompt: `You are a friendly Customer Support agent for a restaurant using Lagentry's AI platform. Your role is to help customers with reservations, menu questions, and general inquiries.

Key information about Lagentry's restaurant solutions:
- AI agents can handle reservations 24/7
- Multilingual support for diverse customers
- Integration with booking systems and POS
- Voice agents that sound completely natural
- Reduces wait times and improves customer experience

Your conversation goals:
1. Greet the customer warmly using their name
2. Help with restaurant-related inquiries (reservations, menu, hours)
3. Demonstrate how natural AI conversation can be
4. Show the efficiency of automated customer service
5. If asked about Lagentry, explain how we power restaurant automation

Be helpful, professional, and demonstrate excellent customer service that showcases Lagentry's capabilities.`
  },
  {
    id: 'healthcare',
    title: 'Healthcare Receptionist',
    description: 'Receptionist #Real-Time Booking',
    tags: ['Receptionist', 'Real-Time Booking'],
    icon: '🏥',
    voiceId: 'jqcCZkN6Knx8BJ5TBdYR',
    prompt: `You are a professional Healthcare Receptionist powered by Lagentry's AI platform. Your role is to assist patients with appointments, basic inquiries, and provide helpful healthcare facility information.

Key information about Lagentry's healthcare solutions:
- HIPAA-compliant AI agents for healthcare
- 24/7 appointment scheduling and patient support
- Integration with healthcare management systems
- Reduces administrative burden on staff
- Improves patient experience with instant responses

Your conversation goals:
1. Greet the patient professionally using their name
2. Help with appointment scheduling or general inquiries
3. Demonstrate empathetic and professional healthcare communication
4. Show how AI can improve healthcare accessibility
5. If asked about Lagentry, explain our healthcare automation solutions

Be compassionate, professional, and maintain appropriate healthcare communication standards.`
  }
];

const WhyChooseLagentry: React.FC = () => {
  const navigate = useNavigate();
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [isCallActive, setIsCallActive] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  });

  const handleAgentSelect = (agent: Agent) => {
    setSelectedAgent(agent);
  };

  const handleStartCall = () => {
    if (!selectedAgent) {
      alert('Please select an agent first.');
      return;
    }
    setShowForm(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.phone) {
      alert('Please fill in all fields.');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      alert('Please enter a valid email address.');
      return;
    }

    setShowForm(false);
    setIsCallActive(true);

    try {
      // Start the voice call with ElevenLabs
      await initiateVoiceCall();
    } catch (error) {
      console.error('Error starting call:', error);
      alert('Sorry, there was an error starting the call. Please try again.');
      setIsCallActive(false);
    }
  };

  const initiateVoiceCall = async () => {
    if (!selectedAgent) return;

    const personalizedPrompt = selectedAgent.prompt.replace(
      'using their name',
      `using their name ${formData.name}`
    );

    try {
      const response = await fetch('http://localhost:3001/api/start-voice-call', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: personalizedPrompt,
          voiceId: selectedAgent.voiceId,
          userName: formData.name,
          userEmail: formData.email,
          userPhone: formData.phone,
          agentType: selectedAgent.id
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to start voice call');
      }

      const data = await response.json();
      console.log('Voice call started:', data);
      
      // Play the greeting audio
      if (data.audioUrl) {
        const audio = new Audio(`http://localhost:3001${data.audioUrl}`);
        audio.play().catch(console.error);
      }
      
      // Show call interface with agent greeting
      setTimeout(() => {
        setIsCallActive(false);
        alert(`Call completed! The ${selectedAgent.title} said: "${data.greeting}"\n\nThank you for testing our AI agent!`);
      }, 15000); // End call after 15 seconds for demo

    } catch (error) {
      console.error('Voice call error:', error);
      // Fallback to demo mode if server is not running
      setTimeout(() => {
        setIsCallActive(false);
        alert(`Demo call completed! The ${selectedAgent.title} would have greeted you personally and started a conversation about your business needs.\n\nTo experience the full voice interaction, please ensure the backend server is running.`);
      }, 10000);
    }
  };

  const handleEndCall = () => {
    setIsCallActive(false);
    setSelectedAgent(null);
    setFormData({ name: '', email: '', phone: '' });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <section className="why-choose-section">
      <div className="container">
        <div className="section-header">
          <h2>Why Choose Lagentry?</h2>
          <p className="subtitle">Automation + AI: The Ultimate Advantage</p>
        </div>

        {/* Agent Selection Interface */}
        <div className="test-agent-section">
          <div className="test-agent-container">
            <div className="test-agent-header">
              <h2>Test the Lead Qualification Buyer Live</h2>
              <p className="test-agent-subtitle">
                This agent can answer questions using trusted internal documents or URLs.
              </p>
            </div>

            <div className="agent-selection-layout">
              {/* Left side - Agent options */}
              <div className="agent-options">
                {agents.map((agent) => (
                  <div
                    key={agent.id}
                    className={`agent-option ${selectedAgent?.id === agent.id ? 'selected' : ''}`}
                    onClick={() => handleAgentSelect(agent)}
                  >
                    <div className="agent-icon">{agent.icon}</div>
                    <div className="agent-info">
                      <h4 className="agent-title">{agent.title}</h4>
                      <p className="agent-description">{agent.description}</p>
                    </div>
                  </div>
                ))}
                
                <div className="call-option">
                  <p className="call-text">or call from phone</p>
                  <div className="phone-number">
                    <span className="phone-icon">📞</span>
                    <span>+1 (740) 284-8845</span>
                  </div>
                </div>
              </div>

              {/* Right side - Agent preview and call button */}
              <div className="agent-preview">
                {selectedAgent ? (
                  <div className="agent-preview-content">
                    <div className="agent-sphere">
                      <div className="sphere-animation"></div>
                    </div>
                    <h3 className="agent-name">{selectedAgent.title.split('•')[0].trim()}</h3>
                    <div className="agent-status">
                      <span className="status-dot"></span>
                      <span>Available</span>
                    </div>
                    <button 
                      className="start-call-btn"
                      onClick={handleStartCall}
                      disabled={isCallActive}
                    >
                      {isCallActive ? 'Call in Progress...' : 'Start a call'}
                    </button>
                  </div>
                ) : (
                  <div className="no-agent-selected">
                    <p>Select an agent to start testing</p>
                  </div>
                )}
              </div>
            </div>

            <div className="demo-note">
              <p>This is a simplified demo. Full editing is available in the platform.</p>
              <button 
                className="full-platform-btn"
                onClick={() => navigate('/book-demo')}
              >
                Try the Full Platform
              </button>
            </div>
          </div>
        </div>

        {/* Form Modal */}
        {showForm && (
          <div className="form-modal-overlay">
            <div className="form-modal">
              <div className="form-modal-header">
                <h3>Start Your Call with {selectedAgent?.title}</h3>
                <button 
                  className="close-btn"
                  onClick={() => setShowForm(false)}
                >
                  ×
                </button>
              </div>
              <form onSubmit={handleFormSubmit} className="call-form">
                <div className="form-field">
                  <label>Your Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    required
                  />
                </div>
                <div className="form-field">
                  <label>Work Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="you@company.com"
                    required
                  />
                </div>
                <div className="form-field">
                  <label>Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+1 (555) 123-4567"
                    required
                  />
                </div>
                <button type="submit" className="submit-call-btn">
                  Start Call Now
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Active Call Interface */}
        {isCallActive && (
          <div className="call-active-overlay">
            <div className="call-active-modal">
              <div className="call-header">
                <h3>Speaking with {selectedAgent?.title}</h3>
                <div className="call-timer">00:30</div>
              </div>
              <div className="call-content">
                <div className="agent-avatar">
                  <div className="voice-animation">
                    <div className="voice-wave"></div>
                    <div className="voice-wave"></div>
                    <div className="voice-wave"></div>
                  </div>
                </div>
                <p className="call-status">Connected - AI Agent is speaking...</p>
                <p className="call-instruction">The agent will introduce themselves and start the conversation.</p>
              </div>
              <button 
                className="end-call-btn"
                onClick={handleEndCall}
              >
                End Call
              </button>
            </div>
          </div>
        )}

        {/* Meeting Assistant Feature */}
        <div className="feature-block">
          <div className="feature-content">
            <h3>Meeting Assistant for Sales Reps</h3>
            <p className="feature-subtitle">The ultimate cheat code for sales reps.</p>
            <p className="feature-description">
              Never miss a detail. Our assistant joins your meetings, researches prospects in real-time, and provides live pitch guidance.
            </p>
            <ul className="feature-list">
              <li>Joins sales meetings (without anyone knowing!)</li>
              <li>DeepResearches customer instantly</li>
              <li>Gives pitch guidance live</li>
              <li>Works in EN + AR</li>
            </ul>
            <p className="tagline">Sell with Confidence.</p>
          </div>
          <div className="feature-media">
            <div className="video-placeholder">
              <video
                className="feature-video"
                src={`${process.env.PUBLIC_URL}/whyvd.MP4`}
                autoPlay
                muted
                loop
                playsInline
              />
            </div>
          </div>
        </div>

        {/* Voice Cloning Feature */}
        <div className="feature-block reverse">
          <div className="feature-content">
            <h3>Voice Cloning Feature</h3>
            <p className="feature-description">
              Clone your voice in less than 2 minutes! Create a digital twin that sounds exactly like you for consistent, scalable communication.
            </p>
            <ul className="feature-list">
              <li>Voice can be used for phone or web agents</li>
              <li>Your AI Agent uses emotions for a more natural feel</li>
              <li>No one knows it's AI, and not you!</li>
            </ul>
          </div>
          <div className="feature-media">
            <div className="video-placeholder">
              <video
                className="feature-video"
                src={`${process.env.PUBLIC_URL}/whyvd.MP4`}
                autoPlay
                muted
                loop
                playsInline
              />
            </div>
          </div>
        </div>

        {/* What We Replace Section */}
        <div className="comparison-section">
          <h3>What We Replace</h3>
          <p className="subtitle">One Platform to Rule Them All</p>

          <div className="pes-section agent-matrix">
            <div className="pes-grid">
              {/* Prospect column */}
              <div className="pes-column">
                <h3>Prospect</h3>

                <div className="pes-row">
                  <div className="pes-row-main">
                    <span className="pes-row-title">GTM / Sales Agent</span>
                    <div className="pes-row-logos">
                      <img src="/images/platforms/zoominfo.png" alt="ZoomInfo" />
                      <img src="/images/platforms/seamless-ai.png" alt="Seamless.ai" />
                      <img src="/images/platforms/clay.png" alt="Clay" />
                      <img src="/images/platforms/outreach.png" alt="Outreach" />
                      <img src="/images/platforms/salesloft.png" alt="Salesloft" />
                    </div>
                  </div>
                  <div className="pes-row-price">
                    <span>$2,500</span>
                    <span className="pes-row-price-muted">/month</span>
                  </div>
                </div>

                <div className="pes-row">
                  <div className="pes-row-main">
                    <span className="pes-row-title">CFO / Finance Agent</span>
                    <div className="pes-row-logos">
                      <img src="/images/platforms/quickbooks.png" alt="QuickBooks" />
                      <img src="/images/platforms/xero.png" alt="Xero" />
                      <img src="/images/platforms/freshbooks.png" alt="FreshBooks" />
                      <img src="/images/platforms/zoho-books.png" alt="Zoho Books" />
                      <img src="/images/platforms/bill-com.png" alt="Bill.com" />
                    </div>
                  </div>
                  <div className="pes-row-price">
                    <span>$1,200</span>
                    <span className="pes-row-price-muted">/month</span>
                  </div>
                </div>

                <div className="pes-row">
                  <div className="pes-row-main">
                    <span className="pes-row-title">HR / Recruitment Agent</span>
                    <div className="pes-row-logos">
                      <img src="/images/platforms/greenhouse.png" alt="Greenhouse" />
                      <img src="/images/platforms/bamboohr.png" alt="BambooHR" />
                      <img src="/images/platforms/lever.png" alt="Lever" />
                      <img src="/images/platforms/ashby.png" alt="Ashby" />
                      <img src="/images/platforms/rippling.png" alt="Rippling" />
                    </div>
                  </div>
                  <div className="pes-row-price">
                    <span>$1,000</span>
                    <span className="pes-row-price-muted">/month</span>
                  </div>
                </div>

                <div className="pes-row">
                  <div className="pes-row-main">
                    <span className="pes-row-title">Real Estate Agent</span>
                    <div className="pes-row-logos">
                      <img src="/images/platforms/zillow-premier-agent.png" alt="Zillow" />
                      <img src="/images/platforms/propertyware.png" alt="Propertyware" />
                      <img src="/images/platforms/buildium.png" alt="Buildium" />
                      <img src="/images/platforms/appfolio.png" alt="AppFolio" />
                      <img src="/images/platforms/yardi.png" alt="Yardi" />
                    </div>
                  </div>
                  <div className="pes-row-price">
                    <span>$1,500</span>
                    <span className="pes-row-price-muted">/month</span>
                  </div>
                </div>
              </div>

              {/* Engage column */}
              <div className="pes-column">
                <h3>Engage</h3>

                <div className="pes-row">
                  <div className="pes-row-main">
                    <span className="pes-row-title">Customer Support Agent</span>
                    <div className="pes-row-logos">
                      <img src="/images/platforms/zendesk.png" alt="Zendesk" />
                      <img src="/images/platforms/intercom.png" alt="Intercom" />
                      <img src="/images/platforms/freshdesk.png" alt="Freshdesk" />
                      <img src="/images/platforms/helpscout.png" alt="HelpScout" />
                      <img src="/images/platforms/crisp.png" alt="Crisp" />
                    </div>
                  </div>
                  <div className="pes-row-price">
                    <span>$1,000</span>
                    <span className="pes-row-price-muted">/month</span>
                  </div>
                </div>

                <div className="pes-row">
                  <div className="pes-row-main">
                    <span className="pes-row-title">Voice Calling Agents</span>
                    <div className="pes-row-logos">
                      <img src="/images/platforms/retell-ai.png" alt="Retell AI" />
                      <img src="/images/platforms/twilio-voice.png" alt="Twilio Voice" />
                      <img src="/images/platforms/aircall.png" alt="AirCall" />
                      <img src="/images/platforms/justcall.png" alt="JustCall" />
                      <img src="/images/platforms/vapi.png" alt="VAPI" />
                    </div>
                  </div>
                  <div className="pes-row-price">
                    <span>$800</span>
                    <span className="pes-row-price-muted">/month</span>
                  </div>
                </div>

                <div className="pes-row">
                  <div className="pes-row-main">
                    <span className="pes-row-title">Voice Cloning Platforms</span>
                    <div className="pes-row-logos">
                      <img src="/images/platforms/elevenlabs.png" alt="ElevenLabs" />
                      <img src="/images/platforms/play-ht.png" alt="Play.ht" />
                      <img src="/images/platforms/resemble-ai.png" alt="Resemble AI" />
                      <img src="/images/platforms/vocaloid.png" alt="Vocaloid" />
                      <img src="/images/platforms/speechify-voices.png" alt="Speechify Voices" />
                    </div>
                  </div>
                  <div className="pes-row-price">
                    <span>$300</span>
                    <span className="pes-row-price-muted">/month</span>
                  </div>
                </div>

                <div className="pes-row">
                  <div className="pes-row-main">
                    <span className="pes-row-title">Healthcare Agent</span>
                    <div className="pes-row-logos">
                      <img src="/images/platforms/zocdoc.png" alt="Zocdoc" />
                      <img src="/images/platforms/athenahealth.png" alt="AthenaHealth" />
                      <img src="/images/platforms/kareo.png" alt="Kareo" />
                      <img src="/images/platforms/drchrono.png" alt="DrChrono" />
                      <img src="/images/platforms/mend-telehealth.png" alt="Mend Telehealth" />
                    </div>
                  </div>
                  <div className="pes-row-price">
                    <span>$600</span>
                    <span className="pes-row-price-muted">/month</span>
                  </div>
                </div>
              </div>

              {/* Signals column */}
              <div className="pes-column">
                <h3>Signals</h3>

                <div className="pes-row">
                  <div className="pes-row-main">
                    <span className="pes-row-title">Car Dealer Agent</span>
                    <div className="pes-row-logos">
                      <img src="/images/platforms/autoraptor.png" alt="AutoRaptor" />
                      <img src="/images/platforms/dealercenter.png" alt="DealerCenter" />
                      <img src="/images/platforms/vinsolutions.png" alt="VinSolutions" />
                      <img src="/images/platforms/dealersocket.png" alt="DealerSocket" />
                      <img src="/images/platforms/cars-com-dealer-solutions.png" alt="Cars.com Dealer Solutions" />
                    </div>
                  </div>
                  <div className="pes-row-price">
                    <span>$600</span>
                    <span className="pes-row-price-muted">/month</span>
                  </div>
                </div>

                <div className="pes-row">
                  <div className="pes-row-main">
                    <span className="pes-row-title">Debt Collection Agent</span>
                    <div className="pes-row-logos">
                      <img src="/images/platforms/trueaccord.png" alt="TrueAccord" />
                      <img src="/images/platforms/chaser.png" alt="Chaser" />
                      <img src="/images/platforms/dunning-from-chargebee.png" alt="Dunning from Chargebee" />
                      <img src="/images/platforms/upflow-collections.png" alt="Upflow Collections" />
                      <img src="/images/platforms/collectai.png" alt="CollectAI" />
                    </div>
                  </div>
                  <div className="pes-row-price">
                    <span>$50</span>
                    <span className="pes-row-price-muted">/month</span>
                  </div>
                </div>

                <div className="pes-row">
                  <div className="pes-row-main">
                    <span className="pes-row-title">Invoice Agent</span>
                    <div className="pes-row-logos">
                      <img src="/images/platforms/chaser.png" alt="Chaser" />
                      <img src="/images/platforms/invoice-ninja.png" alt="Invoice Ninja" />
                      <img src="/images/platforms/zoho-invoice.png" alt="Zoho Invoice" />
                      <img src="/images/platforms/freshbooks.png" alt="FreshBooks" />
                      <img src="/images/platforms/quickbooks-invoicing.png" alt="QuickBooks Invoicing" />
                    </div>
                  </div>
                  <div className="pes-row-price">
                    <span>$500</span>
                    <span className="pes-row-price-muted">/month</span>
                  </div>
                </div>

                <div className="pes-row">
                  <div className="pes-row-main">
                    <span className="pes-row-title">Custom AI Agent Builder</span>
                    <div className="pes-row-logos">
                      <img src="/images/platforms/zapier-ai.png" alt="Zapier AI" />
                      <img src="/images/platforms/make.png" alt="Make" />
                      <img src="/images/platforms/n8n.png" alt="N8N" />
                      <img src="/images/platforms/taskade-agents.png" alt="Taskade Agents" />
                      <img src="/images/platforms/agentgpt.png" alt="AgentGPT" />
                    </div>
                  </div>
                  <div className="pes-row-price">
                    <span>$100</span>
                    <span className="pes-row-price-muted">/month</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Visual connectors from the three columns down to the summary card */}
          <div className="matrix-footer">
            <div className="matrix-connectors">
              <span className="connector-line" />
              <span className="connector-line" />
              <span className="connector-line" />
            </div>

            <div className="cost-card">
              <div className="cost-card-header">
                <span className="cost-card-title">The cost of it all</span>
                <span className="cost-card-old">$10,000+</span>
              </div>
              <div className="cost-card-body">
                <span className="cost-card-with">
                  With
                  <img
                    src="/images/logo.png"
                    alt="Lagentry logo"
                    className="cost-card-logo"
                  />
                  Lagentry
                </span>
                <span className="cost-card-new">$20</span>
                <span className="cost-card-period">/month</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseLagentry;