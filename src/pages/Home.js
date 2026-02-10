import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container screen-fade">
      {/* Logo in top left corner */}
      <div className="logo-top-left">
        <img src="/logo.png" alt="11 Corps Logo" className="corps-logo" />
      </div>

      <div className="home-content">
        {/* System Title */}
        <div className="system-title-section">
          <div className="title-container">
            <h1 className="system-title">Yadgar-e-Shuhada</h1>
            <div className="title-divider"></div>
            <p className="system-subtitle">11 Corps</p>
          </div>
        </div>

        {/* Ayah section below the name */}
        <div className="ayah-section">
          <div className="ayah-container">
            <div className="ayah-arabic">
              وَلَا تَحْسَبَنَّ الَّذِينَ قُتِلُوا فِي سَبِيلِ اللَّهِ أَمْوَاتًا ۚ بَلْ أَحْيَاءٌ عِندَ رَبِّهِمْ يُرْزَقُونَ
            </div>
            <div className="ayah-translation">
              "And never think of those who have been killed in the cause of Allah as dead. Rather, they are alive with their Lord, receiving provision."
            </div>
            <div className="ayah-reference">
              — Al-Quran 3:169
            </div>
          </div>
        </div>

        {/* Message section */}
        <div className="home-message-section">
          <p className="home-welcome-message">
            We honor the sacrifices of our brave Shuhada, injured personnel, and civilian martyrs. 
            Their valor and dedication to the nation will forever be remembered and cherished.
          </p>
          <p className="home-subtitle">
            Tribute to Shuhada, Injured Personnel, and Civilian Shuhada
          </p>
        </div>
        
        <div className="home-navigation">
          <div className="nav-tabs">
            <button className="nav-tab" onClick={() => navigate('/history')}>
              History
            </button>
            <button className="nav-tab" onClick={() => navigate('/shuhada')}>
              Shuhada
            </button>
            <button className="nav-tab" onClick={() => navigate('/summaries')}>
              Summaries
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
