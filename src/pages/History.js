import React from 'react';
import { useNavigate } from 'react-router-dom';
import './History.css';

const History = () => {
  const navigate = useNavigate();

  return (
    <div className="history-container screen-fade">
      <div className="logo-top-right">
        <img src="/logo.png" alt="11 Corps Logo" className="corps-logo" />
      </div>

      <button className="btn-back" onClick={() => navigate('/')}>
        Back
      </button>

      <div className="history-content">
        <div className="history-layout">
          <button
            className="history-tab history-tab-top"
            onClick={() => navigate('/achievements')}
          >
            Achievements of 11 Corps
          </button>

          <button 
            className="history-tab history-tab-left"
            onClick={() => navigate('/pictorial-glimpses')}
          >
            Pictorial Glimpses
          </button>

          <div className="history-logo-section">
            <div className="history-logo-ring">
              <div className="history-logo-circle">
                <img src="/logo.png" alt="11 Corps Logo" className="history-logo" />
              </div>
            </div>
          </div>

          <button className="history-tab history-tab-right">
            Major Operations
          </button>
        </div>
      </div>
    </div>
  );
};

export default History;

