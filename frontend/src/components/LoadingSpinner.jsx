import React from 'react';
import './LoadingSpinner.css';

const LoadingSpinner = ({ fullScreen = false }) => {
  return (
    <div className={`spinner-container ${fullScreen ? 'fullscreen' : ''}`}>
      <div className="spinner">
        <div className="double-bounce1"></div>
        <div className="double-bounce2"></div>
      </div>
      <p className="spinner-text">Đang tải dữ liệu...</p>
    </div>
  );
};

export default LoadingSpinner;
