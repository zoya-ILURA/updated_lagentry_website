import React, { useRef, useState, useEffect } from 'react';
import './AgentDemoCards.css';
import realVoiceDemo from '../realvoicedemo.mp3';
// Sales video path - file should be in public folder
const salesVideo = `${process.env.PUBLIC_URL}/sales.mp4`;
import agentBg from './agentbg2.png';
// Video paths - files should be in public folder
// Files are in: public/AICFO.MP4, public/HRvc.gif, public/vim1.mp4, public/vim2.mp4
const aiCFOVideo = `${process.env.PUBLIC_URL}/AICFO.MP4`;
const hrVideo = '/HRvc.gif';

interface AgentCard {
  id: string;
  name: string;
  description: string;
  video: string;
  color: string;
  features: string[];
}

const agents: AgentCard[] = [
  {
    id: 'agent-1',
    name: 'Real Estate Agent',
    description: 'Intelligent automation for your real estate workflows with advanced AI capabilities that streamline property management and boost productivity.',
    video: hrVideo,
    color: '#A78BFA',
    features: [
      'Property listing management',
      'Automated tenant screening',
      'Maintenance request handling',
      'Real estate market analytics'
    ]
  },
  {
    id: 'agent-2',
    name: 'AI Sales Agent',
    description: 'Revolutionary AI-powered sales automation that transforms customer interactions, streamlines sales processes, and drives revenue growth through intelligent automation.',
    video: salesVideo,
    color: '#8B5CF6',
    features: [
      'Intelligent lead qualification and scoring',
      'Automated sales pipeline management',
      'Customer engagement automation',
      'Real-time sales analytics and insights'
    ]
  },
  {
    id: 'agent-3',
    name: 'HR Agent',
    description: 'Streamline your human resources operations with intelligent automation that handles recruitment, employee management, and HR workflows efficiently.',
    video: `${process.env.PUBLIC_URL}/vim2.mp4`,
    color: '#C084FC',
    features: [
      'Automated recruitment processes',
      'Employee onboarding automation',
      'Performance review management',
      'HR analytics and insights'
    ]
  }
];

// AI CFO Agent content
const aiCFOContent = {
  title: 'AI CFO Agent',
  tagline: 'Transform financial operations with intelligent automation.',
  features: [
    'Automated financial reporting and analysis',
    'Budget planning and forecasting automation',
    'Expense management and approval workflows',
    'Real-time financial insights and dashboards',
    'Invoice processing and accounts payable automation',
    'Compliance monitoring and risk assessment'
  ]
};

const AgentDemoCards: React.FC = () => {
  const [playingCards, setPlayingCards] = useState<{ [key: string]: boolean }>({});
  const [mutedCards, setMutedCards] = useState<{ [key: string]: boolean }>({});
  const [isVisible, setIsVisible] = useState(false);
  const [audioPlaying, setAudioPlaying] = useState<{ [key: string]: boolean }>({});
  const [isIntroComplete, setIsIntroComplete] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<{ [key: string]: HTMLVideoElement | null }>({});
  const audioRefs = useRef<{ [key: string]: HTMLAudioElement | null }>({});
  const aiCFOVideoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    // Set intro as complete immediately so all sections show
    setIsIntroComplete(true);
  }, []);

  useEffect(() => {
    // Always observe for intersection
    if (!isIntroComplete) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, [isIntroComplete]);

  // Autoplay videos when they come into view
  useEffect(() => {
    const videoObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target as HTMLVideoElement;
          const cardId = video.dataset.cardId || (video === aiCFOVideoRef.current ? 'ai-cfo-agent' : '');
          if (entry.isIntersecting) {
            video.play().catch((error) => {
              console.error('Error autoplaying video:', error);
            });
            setPlayingCards(prev => ({ ...prev, [cardId]: true }));
          } else {
            video.pause();
            setPlayingCards(prev => ({ ...prev, [cardId]: false }));
          }
        });
      },
      { threshold: 0.1 }
    );

    Object.values(videoRefs.current).forEach((video) => {
      if (video) {
        videoObserver.observe(video);
      }
    });

    if (aiCFOVideoRef.current) {
      videoObserver.observe(aiCFOVideoRef.current);
    }

    return () => {
      Object.values(videoRefs.current).forEach((video) => {
        if (video) {
          videoObserver.unobserve(video);
        }
      });
      if (aiCFOVideoRef.current) {
        videoObserver.unobserve(aiCFOVideoRef.current);
      }
    };
  }, [isVisible]);

  const handlePlay = (cardId: string) => {
    if (cardId === 'agent-2') {
      const audio = audioRefs.current[cardId];
      if (audio) {
        if (audio.paused) {
          Object.keys(audioRefs.current).forEach((key) => {
            if (key !== cardId && audioRefs.current[key]) {
              audioRefs.current[key]?.pause();
              setAudioPlaying(prev => ({ ...prev, [key]: false }));
            }
          });
          audio.play().then(() => {
            setAudioPlaying(prev => ({ ...prev, [cardId]: true }));
          }).catch((error) => {
            console.error('Error playing audio:', error);
          });
        } else {
          audio.pause();
          setAudioPlaying(prev => ({ ...prev, [cardId]: false }));
        }
      }
    }
  };

  const handleMute = (cardId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const video = videoRefs.current[cardId];
    if (video) {
      video.muted = !video.muted;
      setMutedCards(prev => ({ ...prev, [cardId]: video.muted }));
    }
  };

  // All cards array including AI CFO
  const allCards = [
    { type: 'cfo', data: aiCFOContent },
    ...agents.map(agent => ({ type: 'agent', data: agent }))
  ];

  return (
    <div className="agent-demo-section" ref={sectionRef}>
      <div className="agent-demo-container">
        <div className="agent-demo-header">
          <h2 className="agent-demo-title">Meet our AI Employees</h2>
          <p className="agent-demo-subtitle">
            Experience the power of intelligent automation across all domains
          </p>
        </div>

        <div className="agent-cards-stack">
          {allCards.map((card, index) => {
            // 0 = visual left, content right; 1 = content left, visual right; 2 = visual left, etc.
            const isVisualLeft = index % 2 === 0;
            
            if (card.type === 'cfo') {
              const isPlaying = playingCards['ai-cfo-agent'] || false;
              return (
                <div key="ai-cfo-agent" className={`agent-card-stacked ${isVisualLeft ? 'layout-left-visual' : 'layout-right-visual'}`} style={{ backgroundImage: `url(${agentBg})` }}>
                  <div className="agent-card-inner-stacked">
                    {isVisualLeft ? (
                      <>
                        {/* Visual on left */}
                        <div className="agent-visual-panel-stacked">
                          <div className="agent-video-container">
                            <video
                              ref={aiCFOVideoRef}
                              className="agent-video"
                              src={aiCFOVideo}
                              muted={true}
                              loop={true}
                              autoPlay
                              playsInline
                              preload="auto"
                              style={{ display: 'block', opacity: 1 }}
                              onPlay={() => setPlayingCards(prev => ({ ...prev, 'ai-cfo-agent': true }))}
                              onPause={() => setPlayingCards(prev => ({ ...prev, 'ai-cfo-agent': false }))}
                              onLoadedMetadata={(e) => {
                                const video = e.currentTarget;
                                if (video) {
                                  video.style.display = 'block';
                                  video.style.opacity = '1';
                                }
                              }}
                              onError={(e) => {
                                console.error('CFO Video loading error:', e);
                                const video = e.currentTarget;
                                if (video) {
                                  console.error('Video src:', video.src);
                                  console.error('Video error code:', video.error?.code);
                                }
                              }}
                            />
                          </div>
                        </div>
                        {/* Content on right */}
                        <div className="agent-content-panel-stacked">
                          <h2 className="agent-card-name">{aiCFOContent.title}</h2>
                          <p className="agent-card-description">{aiCFOContent.tagline}</p>
                          <div className="agent-features">
                            {aiCFOContent.features.map((feature, featureIndex) => (
                              <div key={featureIndex} className="agent-feature-item">
                                <span className="agent-feature-text">{feature}</span>
                              </div>
                            ))}
                          </div>
                          <button className="agent-more-about-button">More About {aiCFOContent.title}</button>
                        </div>
                      </>
                    ) : (
                      <>
                        {/* Content on left */}
                        <div className="agent-content-panel-stacked">
                          <h2 className="agent-card-name">{aiCFOContent.title}</h2>
                          <p className="agent-card-description">{aiCFOContent.tagline}</p>
                          <div className="agent-features">
                            {aiCFOContent.features.map((feature, featureIndex) => (
                              <div key={featureIndex} className="agent-feature-item">
                                <span className="agent-feature-text">{feature}</span>
                              </div>
                            ))}
                          </div>
                          <button className="agent-more-about-button">More About {aiCFOContent.title}</button>
                        </div>
                        {/* Visual on right */}
                        <div className="agent-visual-panel-stacked">
                          <div className="agent-video-container">
                            <video
                              ref={aiCFOVideoRef}
                              className="agent-video"
                              src={aiCFOVideo}
                              muted={true}
                              loop={true}
                              autoPlay
                              playsInline
                              preload="auto"
                              style={{ display: 'block', opacity: 1 }}
                              onPlay={() => setPlayingCards(prev => ({ ...prev, 'ai-cfo-agent': true }))}
                              onPause={() => setPlayingCards(prev => ({ ...prev, 'ai-cfo-agent': false }))}
                              onLoadedMetadata={(e) => {
                                const video = e.currentTarget;
                                if (video) {
                                  video.style.display = 'block';
                                  video.style.opacity = '1';
                                }
                              }}
                              onError={(e) => {
                                console.error('CFO Video loading error:', e);
                                const video = e.currentTarget;
                                if (video) {
                                  console.error('Video src:', video.src);
                                  console.error('Video error code:', video.error?.code);
                                }
                              }}
                            />
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              );
            } else {
              const agent = card.data as AgentCard;
              const isPlaying = playingCards[agent.id] || false;
              
              return (
                <div key={agent.id} className={`agent-card-stacked ${isVisualLeft ? 'layout-left-visual' : 'layout-right-visual'}`} style={{ backgroundImage: `url(${agentBg})` }}>
                  <div className="agent-card-inner-stacked">
                    {isVisualLeft ? (
                      <>
                        {/* Visual on left */}
                        <div className="agent-visual-panel-stacked">
                          <div className="agent-video-container">
                            {agent.id === 'agent-1' ? (
                              <img
                                className="agent-video"
                                src={agent.video}
                                alt={`${agent.name} demo`}
                                style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '24px', display: 'block' }}
                                onError={(e) => {
                                  console.error('Image failed to load:', agent.video);
                                  console.error('Full path:', window.location.origin + agent.video);
                                }}
                              />
                            ) : (
                              <video
                                ref={(el) => {
                                  videoRefs.current[agent.id] = el;
                                  if (el) {
                                    el.dataset.cardId = agent.id;
                                  }
                                }}
                                className="agent-video"
                                src={agent.video}
                                muted={mutedCards[agent.id] !== undefined ? mutedCards[agent.id] : true}
                                loop={true}
                                autoPlay
                                playsInline
                                preload="metadata"
                                onPlay={() => setPlayingCards(prev => ({ ...prev, [agent.id]: true }))}
                                onPause={() => setPlayingCards(prev => ({ ...prev, [agent.id]: false }))}
                                onLoadedMetadata={(e) => {
                                  const video = e.currentTarget;
                                  if (video) {
                                    video.style.display = 'block';
                                  }
                                }}
                              />
                            )}
                          </div>
                        </div>
                        {/* Content on right */}
                        <div className="agent-content-panel-stacked">
                          <h3 className="agent-card-name">{agent.name}</h3>
                          <p className="agent-card-description">{agent.description}</p>
                          <div className="agent-features">
                            {agent.features.map((feature, featureIndex) => (
                              <div key={featureIndex} className="agent-feature-item">
                                <span className="agent-feature-text">{feature}</span>
                              </div>
                            ))}
                          </div>
                          {agent.id === 'agent-2' && (
                            <div className="agent-play-button-container" onClick={() => handlePlay(agent.id)}>
                              <button className="agent-play-button" aria-label="Play audio">
                                <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                                  <circle cx="24" cy="24" r="24" fill={agent.color} />
                                  {audioPlaying[agent.id] ? (
                                    <path d="M16 14H20V34H16V14ZM28 14H32V34H28V14Z" fill="white" />
                                  ) : (
                                    <path d="M18 14L18 34L30 24L18 14Z" fill="white" />
                                  )}
                                </svg>
                              </button>
                              <div className="agent-play-text">
                                <span className="agent-play-title" style={{ color: agent.color }}>
                                  Voice Demo for {agent.name}
                                </span>
                                <span className="agent-play-subtitle">General Questions</span>
                              </div>
                            </div>
                          )}
                          <button className="agent-more-about-button">More About {agent.name}</button>
                          {agent.id === 'agent-2' && (
                            <video
                              ref={(el) => {
                                audioRefs.current[agent.id] = el;
                              }}
                              src={salesVideo}
                              onEnded={() => setAudioPlaying(prev => ({ ...prev, [agent.id]: false }))}
                              onPlay={() => setAudioPlaying(prev => ({ ...prev, [agent.id]: true }))}
                              onPause={() => setAudioPlaying(prev => ({ ...prev, [agent.id]: false }))}
                              style={{ display: 'none' }}
                            />
                          )}
                        </div>
                      </>
                    ) : (
                      <>
                        {/* Content on left */}
                        <div className="agent-content-panel-stacked">
                          <h3 className="agent-card-name">{agent.name}</h3>
                          <p className="agent-card-description">{agent.description}</p>
                          <div className="agent-features">
                            {agent.features.map((feature, featureIndex) => (
                              <div key={featureIndex} className="agent-feature-item">
                                <span className="agent-feature-text">{feature}</span>
                              </div>
                            ))}
                          </div>
                          {agent.id === 'agent-2' && (
                            <div className="agent-play-button-container" onClick={() => handlePlay(agent.id)}>
                              <button className="agent-play-button" aria-label="Play audio">
                                <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                                  <circle cx="24" cy="24" r="24" fill={agent.color} />
                                  {audioPlaying[agent.id] ? (
                                    <path d="M16 14H20V34H16V14ZM28 14H32V34H28V14Z" fill="white" />
                                  ) : (
                                    <path d="M18 14L18 34L30 24L18 14Z" fill="white" />
                                  )}
                                </svg>
                              </button>
                              <div className="agent-play-text">
                                <span className="agent-play-title" style={{ color: agent.color }}>
                                  Voice Demo for {agent.name}
                                </span>
                                <span className="agent-play-subtitle">General Questions</span>
                              </div>
                            </div>
                          )}
                          <button className="agent-more-about-button">More About {agent.name}</button>
                          {agent.id === 'agent-2' && (
                            <video
                              ref={(el) => {
                                audioRefs.current[agent.id] = el;
                              }}
                              src={salesVideo}
                              onEnded={() => setAudioPlaying(prev => ({ ...prev, [agent.id]: false }))}
                              onPlay={() => setAudioPlaying(prev => ({ ...prev, [agent.id]: true }))}
                              onPause={() => setAudioPlaying(prev => ({ ...prev, [agent.id]: false }))}
                              style={{ display: 'none' }}
                            />
                          )}
                        </div>
                        {/* Visual on right */}
                        <div className="agent-visual-panel-stacked">
                          <div className="agent-video-container">
                            {agent.id === 'agent-1' ? (
                              <img
                                className="agent-video"
                                src={agent.video}
                                alt={`${agent.name} demo`}
                                style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '24px', display: 'block' }}
                                onError={(e) => {
                                  console.error('Image failed to load:', agent.video);
                                  console.error('Full path:', window.location.origin + agent.video);
                                }}
                              />
                            ) : (
                              <video
                                ref={(el) => {
                                  videoRefs.current[agent.id] = el;
                                  if (el) {
                                    el.dataset.cardId = agent.id;
                                  }
                                }}
                                className="agent-video"
                                src={agent.video}
                                muted={mutedCards[agent.id] !== undefined ? mutedCards[agent.id] : true}
                                loop={true}
                                autoPlay
                                playsInline
                                preload="metadata"
                                onPlay={() => setPlayingCards(prev => ({ ...prev, [agent.id]: true }))}
                                onPause={() => setPlayingCards(prev => ({ ...prev, [agent.id]: false }))}
                                onLoadedMetadata={(e) => {
                                  const video = e.currentTarget;
                                  if (video) {
                                    video.style.display = 'block';
                                  }
                                }}
                              />
                            )}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              );
            }
          })}
        </div>
      </div>
    </div>
  );
};

export default AgentDemoCards;
