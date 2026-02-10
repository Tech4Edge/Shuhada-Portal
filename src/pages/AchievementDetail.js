import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './Achievements.css';
import { achievementsData } from './Achievements';

const AchievementDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const achievement = achievementsData.find((item) => item.id === Number(id));

  if (!achievement) {
    return (
      <div className="achievements-container">
        <div className="logo-top-right">
          <img src="/logo.png" alt="11 Corps Logo" className="corps-logo" />
        </div>
        <button className="btn-back" onClick={() => navigate('/achievements')}>
          Back
        </button>
        <div className="achievements-header">
          <h1 className="achievements-title">Achievement not found</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="achievements-container screen-fade">
      <div className="logo-top-right">
        <img src="/logo.png" alt="11 Corps Logo" className="corps-logo" />
      </div>

      <button className="btn-back" onClick={() => navigate('/achievements')}>
        Back
      </button>

      <div className="achievements-header">
        <h1 className="achievements-title">{achievement.title}</h1>
        <div className="achievements-divider" />
      </div>

      <div className="achievements-item achievements-item-detail">
        <div className="achievements-text">
          <p className="achievements-description">
            {achievement.fullDescription || achievement.shortDescription}
          </p>
        </div>
        <div className="achievements-image-wrapper">
          <div className="achievements-image-frame">
            <img
              src={achievement.image}
              alt={achievement.title}
              className="achievements-image"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AchievementDetail;

