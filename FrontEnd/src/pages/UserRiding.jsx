import React from 'react';
import '../styles/userRiding.css'; // your CSS file path

const UserRiding = () => {
  return (
    <div className="riding-container">
      {/* Map Section */}
      <div className="map-container">
        <img  src="/Uber-map-design.gif" alt="uber-map" id="uber-map"  className="map-image" />
        <div className="arrival-box">
          <p>Arrival<br /><strong>6 min</strong></p>
        </div>
        <div className="uber-logo">Uber</div>
        <div className="exit-icon">↷</div>
      </div>

      {/* Bottom Status Bar */}
      <div className="bottom-bar">
        <span className="distance-info">Ride is Ongoing</span>
        <button className="complete-btn">Payment</button>
      </div>
    </div>
  );
};

export default UserRiding;
