import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './PictorialGlimpses.css';

const PictorialGlimpses = () => {
  const navigate = useNavigate();
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [cardImageIndex, setCardImageIndex] = useState({}); // Track image rotation for each card
  const [currentCardIndex, setCurrentCardIndex] = useState(0); // Track current card in carousel
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const inactivityTimerRef = useRef(null);
  const cardRotationTimerRef = useRef(null);
  const galleryAutoPlayTimerRef = useRef(null);
  const carouselRef = useRef(null);
  const cardWidthRef = useRef(0);

  // Calculate card width based on viewport
  useEffect(() => {
    const updateCardWidth = () => {
      const viewportWidth = window.innerWidth;
      let cardWidth = 400; // default
      let gap = 32; // default gap in pixels
      
      if (viewportWidth >= 2560) {
        cardWidth = Math.min(600, viewportWidth * 0.45);
        gap = viewportWidth * 0.03;
      } else if (viewportWidth >= 1920) {
        cardWidth = Math.min(550, viewportWidth * 0.42);
        gap = viewportWidth * 0.03;
      } else if (viewportWidth >= 1024) {
        cardWidth = Math.min(500, viewportWidth * 0.40);
        gap = viewportWidth * 0.03;
      } else {
        cardWidth = Math.min(450, viewportWidth * 0.85);
        gap = viewportWidth * 0.03;
      }
      
      cardWidthRef.current = cardWidth + gap;
    };

    updateCardWidth();
    window.addEventListener('resize', updateCardWidth);
    return () => window.removeEventListener('resize', updateCardWidth);
  }, []);

  // Event data - easily configurable
  // Using only generic / non-person images from the public folder
  const events = [
    {
      id: 1,
      title: '11 Corps Heritage',
      date: 'Overview',
      coverImages: [
        '/11_Corps_(Pakistan)_logo.png',
        '/logo.png',
        '/imagesonfrontpage.jfif'
      ],
      galleryImages: [
        '/11_Corps_(Pakistan)_logo.png',
        '/logo.png',
        '/imagesonfrontpage.jfif',
        '/image.jfif',
        '/image2.jpg',
        '/bg.avif'
      ]
    },
    {
      id: 2,
      title: 'Operational Landscape',
      date: 'Areas of Responsibility',
      coverImages: [
        '/bg.avif',
        '/image.jfif',
        '/image2.jpg'
      ],
      galleryImages: [
        '/bg.avif',
        '/image.jfif',
        '/image2.jpg',
        '/imagesonfrontpage.jfif',
        '/11_Corps_(Pakistan)_logo.png',
        '/logo.png'
      ]
    },
    {
      id: 3,
      title: 'Pictorial Highlights',
      date: '11 Corps',
      coverImages: [
        '/imagesonfrontpage.jfif',
        '/image.jfif',
        '/bg.avif'
      ],
      galleryImages: [
        '/imagesonfrontpage.jfif',
        '/image.jfif',
        '/image2.jpg',
        '/bg.avif',
        '/11_Corps_(Pakistan)_logo.png',
        '/logo.png'
      ]
    }
  ];

  // Initialize card image indices
  useEffect(() => {
    const initialIndices = {};
    events.forEach(event => {
      initialIndices[event.id] = 0;
    });
    setCardImageIndex(initialIndices);
  }, []);

  // Auto-rotate event cards every 6-8 seconds (using 7 seconds)
  useEffect(() => {
    if (selectedEvent) return; // Don't rotate cards when in gallery view

    cardRotationTimerRef.current = setInterval(() => {
      setCardImageIndex(prev => {
        const updated = { ...prev };
        events.forEach(event => {
          const currentIndex = updated[event.id] || 0;
          const nextIndex = (currentIndex + 1) % event.coverImages.length;
          updated[event.id] = nextIndex;
        });
        return updated;
      });
    }, 7000); // 7 seconds

    return () => {
      if (cardRotationTimerRef.current) {
        clearInterval(cardRotationTimerRef.current);
      }
    };
  }, [selectedEvent]);

  // Auto-play gallery slider (slow fade, 5 seconds per image)
  useEffect(() => {
    if (!selectedEvent) return;

    galleryAutoPlayTimerRef.current = setInterval(() => {
      setCurrentImageIndex(prev => {
        return (prev + 1) % selectedEvent.galleryImages.length;
      });
    }, 5000); // 5 seconds per image

    return () => {
      if (galleryAutoPlayTimerRef.current) {
        clearInterval(galleryAutoPlayTimerRef.current);
      }
    };
  }, [selectedEvent]);

  // Auto-return to main screen after 25 seconds of inactivity
  useEffect(() => {
    if (!selectedEvent) return;

    const resetInactivityTimer = () => {
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
      }

      inactivityTimerRef.current = setTimeout(() => {
        handleBackToMain();
      }, 25000); // 25 seconds
    };

    const handleInteraction = () => {
      resetInactivityTimer();
    };

    resetInactivityTimer();

    // Listen for any user interaction
    window.addEventListener('click', handleInteraction);
    window.addEventListener('touchstart', handleInteraction);
    window.addEventListener('keydown', handleInteraction);

    return () => {
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
      }
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('touchstart', handleInteraction);
      window.removeEventListener('keydown', handleInteraction);
    };
  }, [selectedEvent]);

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setCurrentImageIndex(0);
  };

  const handleBackToMain = () => {
    setSelectedEvent(null);
    setCurrentImageIndex(0);
  };

  const handleNextImage = () => {
    if (!selectedEvent) return;
    setCurrentImageIndex(prev => (prev + 1) % selectedEvent.galleryImages.length);
    // Reset inactivity timer
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
      inactivityTimerRef.current = setTimeout(() => {
        handleBackToMain();
      }, 25000);
    }
  };

  const handlePreviousImage = () => {
    if (!selectedEvent) return;
    setCurrentImageIndex(prev => 
      prev === 0 ? selectedEvent.galleryImages.length - 1 : prev - 1
    );
    // Reset inactivity timer
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
      inactivityTimerRef.current = setTimeout(() => {
        handleBackToMain();
      }, 25000);
    }
  };

  // Carousel navigation functions
  const handleNextCard = () => {
    setCurrentCardIndex(prev => {
      const next = prev + 1;
      return next >= events.length ? 0 : next;
    });
  };

  const handlePreviousCard = () => {
    setCurrentCardIndex(prev => {
      const prevIndex = prev - 1;
      return prevIndex < 0 ? events.length - 1 : prevIndex;
    });
  };

  // Touch handlers for swipe
  const minSwipeDistance = 50;

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      handleNextCard();
    }
    if (isRightSwipe) {
      handlePreviousCard();
    }
  };

  // Mouse wheel handler
  useEffect(() => {
    const handleWheel = (e) => {
      if (selectedEvent) return; // Don't scroll in gallery view
      
      e.preventDefault();
      const delta = e.deltaY;
      
      if (delta > 0) {
        setCurrentCardIndex(prev => {
          const next = prev + 1;
          return next >= events.length ? 0 : next;
        });
      } else if (delta < 0) {
        setCurrentCardIndex(prev => {
          const prevIndex = prev - 1;
          return prevIndex < 0 ? events.length - 1 : prevIndex;
        });
      }
    };

    const carouselElement = carouselRef.current?.parentElement;
    if (carouselElement) {
      carouselElement.addEventListener('wheel', handleWheel, { passive: false });
      return () => {
        carouselElement.removeEventListener('wheel', handleWheel);
      };
    }
  }, [selectedEvent, events.length]);

  // Main cards view
  if (!selectedEvent) {
    return (
      <div className="pictorial-container screen-fade">
        <div className="logo-top-right">
          <img src="/logo.png" alt="11 Corps Logo" className="corps-logo" />
        </div>

        <button className="btn-back" onClick={() => navigate('/history')}>
          Back
        </button>

        <div className="pictorial-content">
          <h1 className="pictorial-title">Pictorial Glimpses</h1>
          <div className="pictorial-subtitle">Event Highlights</div>

          <div 
            className="event-cards-carousel-wrapper"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            <button 
              className="carousel-nav-btn carousel-prev-btn"
              onClick={handlePreviousCard}
              aria-label="Previous Card"
            >
              ←
            </button>
            
            <div className="event-cards-container" ref={carouselRef}>
              <div 
                className="event-cards-track"
                style={{ 
                  transform: `translateX(-${currentCardIndex * cardWidthRef.current}px)` 
                }}
              >
                {events.map((event, index) => {
                  const currentCoverIndex = cardImageIndex[event.id] || 0;
                  const currentCoverImage = event.coverImages[currentCoverIndex];
                  const isActive = index === currentCardIndex;

                  return (
                    <div
                      key={event.id}
                      className={`event-card ${isActive ? 'active' : ''}`}
                      onClick={() => handleEventClick(event)}
                    >
                      <div className="event-card-image-wrapper">
                        <img
                          src={currentCoverImage}
                          alt={event.title}
                          className="event-card-image"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                        <div className="event-card-placeholder" style={{ display: 'none' }}>
                          <div className="placeholder-icon-large">📷</div>
                          <div className="placeholder-text">{event.title}</div>
                        </div>
                        {/* Image indicators */}
                        {event.coverImages.length > 1 && (
                          <div className="image-indicators">
                            {event.coverImages.map((_, index) => (
                              <div
                                key={index}
                                className={`indicator ${index === currentCoverIndex ? 'active' : ''}`}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="event-card-info">
                        <h2 className="event-card-title">{event.title}</h2>
                        {event.date && (
                          <div className="event-card-date">{event.date}</div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <button 
              className="carousel-nav-btn carousel-next-btn"
              onClick={handleNextCard}
              aria-label="Next Card"
            >
              →
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Fullscreen gallery view
  return (
    <div className="gallery-fullscreen screen-fade">
      <button className="gallery-back-btn" onClick={handleBackToMain}>
        Back
      </button>

      <div className="gallery-content">
        <div className="gallery-image-container">
          <img
            src={selectedEvent.galleryImages[currentImageIndex]}
            alt={`${selectedEvent.title} - Image ${currentImageIndex + 1}`}
            className="gallery-main-image"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
          <div className="gallery-placeholder-fullscreen" style={{ display: 'none' }}>
            <div className="placeholder-icon-large">📷</div>
            <div className="placeholder-text-large">{selectedEvent.title}</div>
          </div>
        </div>

        <div className="gallery-controls">
          <button 
            className="gallery-nav-btn gallery-prev-btn"
            onClick={handlePreviousImage}
            aria-label="Previous Image"
          >
            ← Previous
          </button>
          
          <div className="gallery-info">
            <h2 className="gallery-event-title">{selectedEvent.title}</h2>
            <div className="gallery-counter">
              {currentImageIndex + 1} / {selectedEvent.galleryImages.length}
            </div>
          </div>

          <button 
            className="gallery-nav-btn gallery-next-btn"
            onClick={handleNextImage}
            aria-label="Next Image"
          >
            Next →
          </button>
        </div>

        {/* Image thumbnails indicator */}
        <div className="gallery-thumbnails">
          {selectedEvent.galleryImages.map((image, index) => (
            <div
              key={index}
              className={`thumbnail-indicator ${index === currentImageIndex ? 'active' : ''}`}
              onClick={() => {
                setCurrentImageIndex(index);
                // Reset inactivity timer
                if (inactivityTimerRef.current) {
                  clearTimeout(inactivityTimerRef.current);
                  inactivityTimerRef.current = setTimeout(() => {
                    handleBackToMain();
                  }, 25000);
                }
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PictorialGlimpses;
