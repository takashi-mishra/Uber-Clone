// Components/RidePopUp.jsx
import React from 'react';
import '../styles/captionHome.css';
import { IoLocationSharp } from "react-icons/io5";
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const RidePopUp = ({ rideData, onAccept, onIgnore }) => {
  if (!rideData) return null;
  const { user, pickup, destination, fare, distance } = rideData;

  async function confirmRideData(rideData,) {
    try {
      const token = localStorage.getItem('capToken');
      const decoded = jwtDecode(token); 
      const captionId = decoded._id;

      const responseData = await axios.post(
        `${import.meta.env.VITE_API_URL}/rides/confirmRide`,
        {
          rideId: rideData._id,
          driverId: captionId
        },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true
        }
      );
      console.log("✅ Ride confirmed:", responseData);
    } catch (error) {
      console.log(`❌ Ride confirm error: ${error.message}`);
    }
  }

  return (
    <div className="ride-popup">
      <h3 className='text-ride-alert'>New Ride <span>Alert</span></h3>

      <div className="ride-header">
        <img src="/cute-user.webp" alt={user?.fullname} className="user-image" />
        <div className="user-info">
          <h3>{user?.fullname}</h3>
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

      <div className="ride-actions">
        <button className="confirm" onClick={() => {
          onAccept();
          confirmRideData(rideData, user);
        }}>Accept</button>
        <button className="ignore" onClick={onIgnore}>Ignore</button>
      </div>
    </div>
  );
};

export default RidePopUp;
