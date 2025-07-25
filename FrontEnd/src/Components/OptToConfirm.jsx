import React, { useState } from 'react';
import '../styles/captionHome.css';
import { IoLocationSharp } from "react-icons/io5";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const OptToConfirm = ({ rideData }) => {
  const [otp, setOtp] = useState('');
  const [optionDown, setOptionDown] = useState(false);
  const navigate = useNavigate();

  const { user, pickup, destination, fare, distance, _id: rideId } = rideData || {};

  const dropDown = () => setOptionDown(true);

  // ✅ OTP confirm handler
  const handleConfirm = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('capToken');
    if (!token) {
      alert('Authorization token missing');
      return;
    }

    if (!otp || !rideId) {
      alert('Please enter OTP');
      return;
    }

    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/rides/start-ride`, {
        params: { rideId, otp },
        headers: {
          Authorization: `Bearer ${token}`
        },
        withCredentials: true // optional based on your backend setup
      });

      if (response.status === 200) {
        console.log('✅ Ride Started');
        navigate('/captionRiding'); // 🔁 Redirect after OTP verification
      }
    } catch (err) {
      console.error('❌ OTP Error:', err.response?.data?.message || err.message);
      alert(err.response?.data?.message || 'OTP verification failed');
    }
  };

  return (
    <div className={`ride-popup-confirm ${optionDown ? "active" : "try"}`}>
      <div className="ride-header">
        <img src="/cute-user.webp" alt={user?.fullname} className="user-image" />
        <div className="user-info">
          <h3>{user?.fullname || "User"}</h3>
          <span className="distance">{distance?.toFixed(1)} KM</span>
        </div>
      </div>

      <div className="ride-location">
        <h3><IoLocationSharp /> Pickup: {pickup}</h3>
        <h3><IoLocationSharp /> Destination: {destination}</h3>
      </div>

      <div className="ride-fare">
        <p>₹{fare?.toFixed(2)}</p>
        <span>Cash</span>
      </div>

      <form className="ride-actions-confirm" onSubmit={handleConfirm}>
        <input
          type="text"
          placeholder="Enter OTP"
          className="otpinput"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />
        <button className="confirm" type="submit">Confirm</button>
        <button className="ignore-confirm" type="button" onClick={dropDown}>Ignore</button>
      </form>
    </div>
  );
};

export default OptToConfirm;
