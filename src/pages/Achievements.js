import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Achievements.css';

export const achievementsData = [
  {
    id: 1,
    title: 'Stabilisation of Khyber Pakhtunkhwa',
    shortDescription:
      '11 Corps has led sustained operations to stabilise Khyber Pakhtunkhwa, restoring state writ in remote valleys, securing key communication routes, and enabling the safe return of displaced families.',
    fullDescription:
      '11 Corps has led sustained operations to stabilise Khyber Pakhtunkhwa, restoring state writ in remote valleys, securing key communication routes, and enabling the safe return of displaced families. '
      + 'Its formations have worked in close coordination with civil administration to re‑establish law and order, reopen schools and markets, and create conditions for long‑term peace. '
      + 'Continuous presence, effective area domination, and engagement with local communities have strengthened public confidence in state institutions.',
    image: '/image2.jpg',
  },
  {
    id: 2,
    title: 'Counter Terrorism Operations',
    shortDescription:
      'Through precise intelligence‑based operations and close cooperation with civil agencies, its formations have neutralised numerous terrorist networks while protecting innocent lives and critical infrastructure.',
    fullDescription:
      'Through precise intelligence‑based operations and close cooperation with civil agencies, 11 Corps formations have neutralised numerous terrorist networks while protecting innocent lives and critical infrastructure. '
      + 'Units have conducted night raids, cordon and search missions, and long‑range area sanitisation to deny militants safe havens. '
      + 'These efforts have significantly reduced the threat of terrorism and enabled normal civic and economic activity to resume in affected regions.',
    image: '/image.jfif',
  },
  {
    id: 3,
    title: 'Humanitarian Support and Relief',
    shortDescription:
      'Beyond combat, troops of 11 Corps have consistently supported local communities during floods, earthquakes, and other emergencies, providing timely relief, medical care, and engineering support.',
    fullDescription:
      'Beyond combat, troops of 11 Corps have consistently supported local communities during floods, earthquakes, and other emergencies, providing timely relief, medical care, and engineering support. '
      + 'Troops have restored damaged roads and bridges, evacuated vulnerable families, and established medical camps in remote areas. '
      + 'These humanitarian efforts reflect the Corps’ enduring commitment to the safety, dignity, and well‑being of the people of Pakistan.',
    image: '/imagesonfrontpage.jfif',
  },
];

const Achievements = () => {
  const navigate = useNavigate();

  return (
    <div className="achievements-container screen-fade">
      <div className="logo-top-right">
        <img src="/logo.png" alt="11 Corps Logo" className="corps-logo" />
      </div>

      <button className="btn-back" onClick={() => navigate('/history')}>
        Back
      </button>

      <div className="achievements-header">
        <h1 className="achievements-title">Achievements of 11 Corps</h1>
        <div className="achievements-divider" />
      </div>

      <div className="achievements-list">
        {achievementsData.map((item) => (
          <div
            key={item.id}
            className="achievements-item"
            onClick={() => navigate(`/achievements/${item.id}`)}
          >
            <div className="achievements-text">
              <h2 className="achievements-item-title">{item.title}</h2>
              <p className="achievements-description achievements-description-clamp">
                {item.shortDescription}
                {item.fullDescription && item.fullDescription.length > item.shortDescription.length
                  ? ' ...'
                  : ''}
              </p>
            </div>
            <div className="achievements-image-wrapper">
              <div className="achievements-image-frame">
                <img
                  src={item.image}
                  alt={item.title}
                  className="achievements-image"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Achievements;

