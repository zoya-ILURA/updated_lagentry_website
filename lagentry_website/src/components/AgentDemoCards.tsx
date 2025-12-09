import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AgentDemoCards.css';
import realVoiceDemo from '../realvoicedemo.mp3';
// Sales video path - file should be in public folder
// Use absolute path for Netlify deployment compatibility
const salesVideo = '/sales.mp4';
import agentBg from './agentbg2.png';
// Video paths - files should be in public folder
// Files are in: public/AICFO.mp4, public/HRvc.gif, public/vim1.mp4, public/vim2.mp4
// Note: File is AICFO.mp4 (lowercase) - Netlify is case-sensitive
// Use absolute paths for Netlify deployment compatibility
const aiCFOVideo = '/AICFO.mp4';
const hrVideo = '/HRvc.mp4';

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
    video: '/vim2.mp4',
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
  const navigate = useNavigate();

  const [playingCards, setPlayingCards] = useState<{ [key: string]: boolean }>({});
  const [mutedCards, setMutedCards] = useState<{ [key: string]: boolean }>({});
  const [isVisible, setIsVisible] = useState(false);
  const [audioPlaying, setAudioPlaying] = useState<{ [key: string]: boolean }>({});
  const [isIntroComplete, setIsIntroComplete] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<{ [key: string]: HTMLVideoElement | null }>({});
  const audioRefs = useRef<{ [key: string]: HTMLAudioElement | null }>({});
  const aiCFOVideoRef = useRef<HTMLVideoElement | null>(null);
  const aiCFORetryCountRef = useRef<number>(0);

  const handleMoreAbout = (cardType: 'cfo' | 'agent', id: string) => {
    if (cardType === 'cfo') {
      navigate('/agents/cfo-finance');
      return;
    }

    switch (id) {
      case 'agent-1':
        navigate('/agents/real-estate');
        break;
      case 'agent-2':
        navigate('/agents/gtm-sales');
        break;
      case 'agent-3':
        navigate('/agents/hr-recruitment');
        break;
      default:
        navigate('/agents');
    }
  };

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
              // Only log if it's not a common browser restriction error
              if (error.name !== 'NotAllowedError' && error.name !== 'NotSupportedError') {
                console.warn('Video autoplay prevented:', error.name);
              }
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
          <h2 className="agent-demo-title gradient-purple-text">Meet our AI Employees</h2>
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
                <div
                  key="ai-cfo-agent"
                  className="agent-card-stacked cfo-card layout-left-visual"
                  style={{ backgroundImage: `url(${agentBg})` }}
                >
                  <div className="agent-card-inner-stacked">
                    {true ? (
                      <>
                        {/* Visual on left */}
                        <div className="agent-visual-panel-stacked">
                          <div className="agent-video-container cfo-video-container">
                            <video
                              ref={aiCFOVideoRef}
                              className="agent-video cfo-video"
                              src={aiCFOVideo}
                              muted={true}
                              loop={true}
                              autoPlay
                              playsInline
                              preload="auto"
                              crossOrigin="anonymous"
                              style={{ display: 'block', opacity: 1 }}
                              onCanPlay={(e) => {
                                const video = e.currentTarget;
                                console.log('AICFO video can play - ready to play');
                                video.style.display = 'block';
                                video.style.opacity = '1';
                              }}
                              onLoadedData={(e) => {
                                const video = e.currentTarget;
                                console.log('AICFO video data loaded successfully');
                                video.style.display = 'block';
                              }}
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
                                const video = e.currentTarget;
                                if (video && video.error) {
                                  const errorCode = video.error.code;
                                  const errorMessage = video.error.message || 'Unknown error';
                                  
                                  // Check file size first - if it's too small, the file is corrupted
                                  fetch(video.src, { method: 'HEAD' })
                                    .then(response => {
                                      const contentLength = response.headers.get('Content-Length');
                                      const fileSize = contentLength ? parseInt(contentLength, 10) : 0;
                                      
                                      console.error('AICFO Video Error Details:', {
                                        errorCode,
                                        errorMessage,
                                        videoSrc: video.src,
                                        fileSize: fileSize,
                                        fileSizeMB: (fileSize / (1024 * 1024)).toFixed(2),
                                        networkState: video.networkState,
                                        readyState: video.readyState,
                                        canPlayType: video.canPlayType('video/mp4'),
                                        httpStatus: response.status,
                                        contentType: response.headers.get('Content-Type')
                                      });
                                      
                                      // If file size is suspiciously small (< 1KB), it's likely corrupted or wrong file
                                      if (fileSize < 1024) {
                                        console.error('CRITICAL: Video file is too small (' + fileSize + ' bytes). File is corrupted or not uploaded correctly.');
                                        console.error('Please verify AICFO.mp4 exists in public folder and is a valid video file.');
                                        
                                        // Prevent infinite retry loop - only retry once
                                        if (aiCFORetryCountRef.current < 1) {
                                          aiCFORetryCountRef.current++;
                                          // Try to reload the video with cache busting
                                          const cacheBuster = '?t=' + Date.now();
                                          const newSrc = video.src.split('?')[0] + cacheBuster;
                                          console.log('Attempting to reload with cache busting:', newSrc);
                                          video.src = newSrc;
                                          video.load();
                                        } else {
                                          console.error('Max retries reached. Video file appears to be corrupted or missing.');
                                          video.style.display = 'none';
                                          const container = video.parentElement;
                                          if (container && !container.querySelector('.video-error-placeholder')) {
                                            const placeholder = document.createElement('div');
                                            placeholder.className = 'video-error-placeholder';
                                            placeholder.textContent = 'Video unavailable';
                                            placeholder.style.cssText = 'display: flex; align-items: center; justify-content: center; width: 100%; height: 100%; background: #1a1a1a; color: #888; font-size: 14px;';
                                            container.appendChild(placeholder);
                                          }
                                        }
                                        return;
                                      }
                                      
                                      // If file size is OK but still error, try different loading strategies
                                      if (errorCode === 4 && fileSize > 1024) {
                                        console.error('Video format issue. Attempting alternative loading methods...');
                                        
                                        // Strategy 1: Try loading as blob
                                        fetch(video.src)
                                          .then(res => {
                                            if (res.ok && res.headers.get('Content-Type')?.includes('video')) {
                                              return res.blob();
                                            }
                                            throw new Error('Invalid response');
                                          })
                                          .then(blob => {
                                            if (blob.size > 1024) {
                                              const blobUrl = URL.createObjectURL(blob);
                                              console.log('Loading video from blob URL');
                                              video.src = blobUrl;
                                              video.load();
                                            } else {
                                              throw new Error('Blob too small');
                                            }
                                          })
                                          .catch(err => {
                                            console.error('Blob loading failed:', err);
                                            // Fall back to retry with different path
                                            retryWithAlternatives(video);
                                          });
                                      } else {
                                        retryWithAlternatives(video);
                                      }
                                    })
                                    .catch(err => {
                                      console.error('Cannot check video file:', err);
                                      retryWithAlternatives(video);
                                    });
                                  
                                  const retryWithAlternatives = (videoElement: HTMLVideoElement) => {
                                    const alternatives = [
                                      '/AICFO.mp4',
                                      '/AICFO.mp4?t=' + Date.now(),
                                      `${window.location.origin}/AICFO.mp4`,
                                      `${window.location.origin}/AICFO.mp4?t=${Date.now()}`
                                    ];
                                    let currentIndex = 0;
                                    const maxRetries = alternatives.length;
                                    
                                    const tryNext = () => {
                                      if (currentIndex < maxRetries && videoElement.error) {
                                        const newSrc = alternatives[currentIndex];
                                        const currentSrc = videoElement.src.split('?')[0].replace(window.location.origin, '');
                                        const newSrcPath = newSrc.split('?')[0].replace(window.location.origin, '');
                                        
                                        if (currentSrc !== newSrcPath) {
                                          console.log(`Retry ${currentIndex + 1}/${maxRetries}: Trying path: ${newSrc}`);
                                          videoElement.src = newSrc;
                                          videoElement.load();
                                        }
                                        currentIndex++;
                                        
                                        // Wait a bit before next retry
                                        if (currentIndex < maxRetries) {
                                          setTimeout(() => {
                                            if (videoElement.error) {
                                              tryNext();
                                            }
                                          }, 500);
                                        }
                                      } else if (videoElement.error) {
                                        console.error('All AICFO video loading attempts failed.');
                                        console.error('Final video src:', videoElement.src);
                                        console.error('Error code:', videoElement.error.code);
                                        
                                        // Show placeholder but keep trying in background
                                        videoElement.style.display = 'none';
                                        const container = videoElement.parentElement;
                                        if (container && !container.querySelector('.video-error-placeholder')) {
                                          const placeholder = document.createElement('div');
                                          placeholder.className = 'video-error-placeholder';
                                          placeholder.textContent = 'Loading video...';
                                          placeholder.style.cssText = 'display: flex; align-items: center; justify-content: center; width: 100%; height: 100%; background: #1a1a1a; color: #888; font-size: 14px;';
                                          container.appendChild(placeholder);
                                          
                                          // Keep trying periodically
                                          const retryInterval = setInterval(() => {
                                            if (!videoElement.error) {
                                              clearInterval(retryInterval);
                                              placeholder.remove();
                                              videoElement.style.display = 'block';
                                            } else {
                                              console.log('Retrying video load...');
                                              videoElement.src = '/AICFO.mp4?retry=' + Date.now();
                                              videoElement.load();
                                            }
                                          }, 5000);
                                        }
                                      }
                                    };
                                    
                                    videoElement.addEventListener('error', tryNext, { once: true });
                                    setTimeout(tryNext, 100);
                                  };
                                }
                              }}
                            />
                          </div>
                        </div>
                        {/* Content on right */}
                        <div className="agent-content-panel-stacked">
                          <h2 className="agent-card-name">{aiCFOContent.title}</h2>
                          <p className="agent-card-description">{aiCFOContent.tagline}</p>
                          <div className="agent-features cfo-features">
                            {aiCFOContent.features.map((feature, featureIndex) => (
                              <div key={featureIndex} className="agent-feature-item cfo-feature-item">
                                <span className="agent-feature-text cfo-feature-text">{feature}</span>
                              </div>
                            ))}
                          </div>
                          <button
                            className="agent-more-about-button"
                            onClick={() => handleMoreAbout('cfo', 'ai-cfo')}
                          >
                            More About {aiCFOContent.title}
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        {/* Content on left */}
                        <div className="agent-content-panel-stacked">
                          <h2 className="agent-card-name">{aiCFOContent.title}</h2>
                          <p className="agent-card-description">{aiCFOContent.tagline}</p>
                          <div className="agent-features cfo-features">
                            {aiCFOContent.features.map((feature, featureIndex) => (
                              <div key={featureIndex} className="agent-feature-item cfo-feature-item">
                                <span className="agent-feature-text cfo-feature-text">{feature}</span>
                              </div>
                            ))}
                          </div>
                          <button
                            className="agent-more-about-button"
                            onClick={() => handleMoreAbout('cfo', 'ai-cfo')}
                          >
                            More About {aiCFOContent.title}
                          </button>
                        </div>
                        {/* Visual on right */}
                        <div className="agent-visual-panel-stacked">
                          <div className="agent-video-container cfo-video-container">
                            <video
                              ref={aiCFOVideoRef}
                              className="agent-video cfo-video"
                              src={aiCFOVideo}
                              muted={true}
                              loop={true}
                              autoPlay
                              playsInline
                              preload="auto"
                              crossOrigin="anonymous"
                              style={{ display: 'block', opacity: 1 }}
                              onCanPlay={(e) => {
                                const video = e.currentTarget;
                                console.log('AICFO video can play - ready to play');
                                video.style.display = 'block';
                                video.style.opacity = '1';
                              }}
                              onLoadedData={(e) => {
                                const video = e.currentTarget;
                                console.log('AICFO video data loaded successfully');
                                video.style.display = 'block';
                              }}
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
                                const video = e.currentTarget;
                                if (video && video.error) {
                                  const errorCode = video.error.code;
                                  const errorMessage = video.error.message || 'Unknown error';
                                  
                                  // Check file size first - if it's too small, the file is corrupted
                                  fetch(video.src, { method: 'HEAD' })
                                    .then(response => {
                                      const contentLength = response.headers.get('Content-Length');
                                      const fileSize = contentLength ? parseInt(contentLength, 10) : 0;
                                      
                                      console.error('AICFO Video Error Details:', {
                                        errorCode,
                                        errorMessage,
                                        videoSrc: video.src,
                                        fileSize: fileSize,
                                        fileSizeMB: (fileSize / (1024 * 1024)).toFixed(2),
                                        networkState: video.networkState,
                                        readyState: video.readyState,
                                        canPlayType: video.canPlayType('video/mp4'),
                                        httpStatus: response.status,
                                        contentType: response.headers.get('Content-Type')
                                      });
                                      
                                      // If file size is suspiciously small (< 1KB), it's likely corrupted or wrong file
                                      if (fileSize < 1024) {
                                        console.error('CRITICAL: Video file is too small (' + fileSize + ' bytes). File is corrupted or not uploaded correctly.');
                                        console.error('Please verify AICFO.mp4 exists in public folder and is a valid video file.');
                                        
                                        // Prevent infinite retry loop - only retry once
                                        if (aiCFORetryCountRef.current < 1) {
                                          aiCFORetryCountRef.current++;
                                          // Try to reload the video with cache busting
                                          const cacheBuster = '?t=' + Date.now();
                                          const newSrc = video.src.split('?')[0] + cacheBuster;
                                          console.log('Attempting to reload with cache busting:', newSrc);
                                          video.src = newSrc;
                                          video.load();
                                        } else {
                                          console.error('Max retries reached. Video file appears to be corrupted or missing.');
                                          video.style.display = 'none';
                                          const container = video.parentElement;
                                          if (container && !container.querySelector('.video-error-placeholder')) {
                                            const placeholder = document.createElement('div');
                                            placeholder.className = 'video-error-placeholder';
                                            placeholder.textContent = 'Video unavailable';
                                            placeholder.style.cssText = 'display: flex; align-items: center; justify-content: center; width: 100%; height: 100%; background: #1a1a1a; color: #888; font-size: 14px;';
                                            container.appendChild(placeholder);
                                          }
                                        }
                                        return;
                                      }
                                      
                                      // If file size is OK but still error, try different loading strategies
                                      if (errorCode === 4 && fileSize > 1024) {
                                        console.error('Video format issue. Attempting alternative loading methods...');
                                        
                                        // Strategy 1: Try loading as blob
                                        fetch(video.src)
                                          .then(res => {
                                            if (res.ok && res.headers.get('Content-Type')?.includes('video')) {
                                              return res.blob();
                                            }
                                            throw new Error('Invalid response');
                                          })
                                          .then(blob => {
                                            if (blob.size > 1024) {
                                              const blobUrl = URL.createObjectURL(blob);
                                              console.log('Loading video from blob URL');
                                              video.src = blobUrl;
                                              video.load();
                                            } else {
                                              throw new Error('Blob too small');
                                            }
                                          })
                                          .catch(err => {
                                            console.error('Blob loading failed:', err);
                                            // Fall back to retry with different path
                                            retryWithAlternatives(video);
                                          });
                                      } else {
                                        retryWithAlternatives(video);
                                      }
                                    })
                                    .catch(err => {
                                      console.error('Cannot check video file:', err);
                                      retryWithAlternatives(video);
                                    });
                                  
                                  const retryWithAlternatives = (videoElement: HTMLVideoElement) => {
                                    const alternatives = [
                                      '/AICFO.mp4',
                                      '/AICFO.mp4?t=' + Date.now(),
                                      `${window.location.origin}/AICFO.mp4`,
                                      `${window.location.origin}/AICFO.mp4?t=${Date.now()}`
                                    ];
                                    let currentIndex = 0;
                                    const maxRetries = alternatives.length;
                                    
                                    const tryNext = () => {
                                      if (currentIndex < maxRetries && videoElement.error) {
                                        const newSrc = alternatives[currentIndex];
                                        const currentSrc = videoElement.src.split('?')[0].replace(window.location.origin, '');
                                        const newSrcPath = newSrc.split('?')[0].replace(window.location.origin, '');
                                        
                                        if (currentSrc !== newSrcPath) {
                                          console.log(`Retry ${currentIndex + 1}/${maxRetries}: Trying path: ${newSrc}`);
                                          videoElement.src = newSrc;
                                          videoElement.load();
                                        }
                                        currentIndex++;
                                        
                                        // Wait a bit before next retry
                                        if (currentIndex < maxRetries) {
                                          setTimeout(() => {
                                            if (videoElement.error) {
                                              tryNext();
                                            }
                                          }, 500);
                                        }
                                      } else if (videoElement.error) {
                                        console.error('All AICFO video loading attempts failed.');
                                        console.error('Final video src:', videoElement.src);
                                        console.error('Error code:', videoElement.error.code);
                                        
                                        // Show placeholder but keep trying in background
                                        videoElement.style.display = 'none';
                                        const container = videoElement.parentElement;
                                        if (container && !container.querySelector('.video-error-placeholder')) {
                                          const placeholder = document.createElement('div');
                                          placeholder.className = 'video-error-placeholder';
                                          placeholder.textContent = 'Loading video...';
                                          placeholder.style.cssText = 'display: flex; align-items: center; justify-content: center; width: 100%; height: 100%; background: #1a1a1a; color: #888; font-size: 14px;';
                                          container.appendChild(placeholder);
                                          
                                          // Keep trying periodically
                                          const retryInterval = setInterval(() => {
                                            if (!videoElement.error) {
                                              clearInterval(retryInterval);
                                              placeholder.remove();
                                              videoElement.style.display = 'block';
                                            } else {
                                              console.log('Retrying video load...');
                                              videoElement.src = '/AICFO.mp4?retry=' + Date.now();
                                              videoElement.load();
                                            }
                                          }, 5000);
                                        }
                                      }
                                    };
                                    
                                    videoElement.addEventListener('error', tryNext, { once: true });
                                    setTimeout(tryNext, 100);
                                  };
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
              
              // Real Estate (agent-1) and HR (agent-3) have video on right, text on left
              // AI Sales (agent-2) has video on left, text on right
              const isVideoRight = agent.id === 'agent-1' || agent.id === 'agent-3';
              
              return (
                <div
                  key={agent.id}
                  className={`agent-card-stacked ${isVideoRight ? 'layout-right-visual' : 'layout-left-visual'} ${
                    agent.id === 'agent-2' ? 'sales-card' : ''
                  }`}
                  style={{ backgroundImage: `url(${agentBg})` }}
                >
                  <div className="agent-card-inner-stacked">
                    {!isVideoRight ? (
                      <>
                        {/* Visual on left */}
                        <div className="agent-visual-panel-stacked">
                          <div className="agent-video-container">
                              <video
                                ref={(el) => {
                                  videoRefs.current[agent.id] = el;
                                  if (el) {
                                    el.dataset.cardId = agent.id;
                                  }
                                }}
                                className={`agent-video ${
                                  agent.id === 'agent-1'
                                    ? 'hr-video'
                                    : agent.id === 'agent-2'
                                    ? 'sales-video'
                                    : ''
                                }`}
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
                          <button
                            className="agent-more-about-button"
                            onClick={() => handleMoreAbout('agent', agent.id)}
                          >
                            More About {agent.name}
                          </button>
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
                          <button
                            className="agent-more-about-button"
                            onClick={() => handleMoreAbout('agent', agent.id)}
                          >
                            More About {agent.name}
                          </button>
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
