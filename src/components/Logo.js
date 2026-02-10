import React from 'react';
import './Logo.css';

const Logo = ({ size = 'medium', className = '' }) => {
  const sizeClass = `logo-${size}`;
  
  return (
    <div className={`logo-container ${sizeClass} ${className}`}>
      <img 
        src="/logo.png" 
        alt="11 Corps Logo" 
        className="corps-logo-img" 
      />
    </div>
  );
};

export default Logo;
