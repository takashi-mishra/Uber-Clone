// pages/CaptionHomePage.jsx
import React, { useEffect, useState } from 'react';
import '../styles/captionHome.css';
import { IoIosSpeedometer } from "react-icons/io";
import { MdAccessTimeFilled, MdLogout } from "react-icons/md";
import { LuNotebook } from "react-icons/lu";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { socket } from '../socket';

import RidePopUp from '../Components/RidePopUp';
import OptToConfirm from '../Components/OptToConfirm';

const CaptionHomePage = () => {
  const [showOtpPanel, setShowOtpPanel] = useState(false); // Show OTP confirm screen
  const [captainData, setCaptainData] = useState({});      // Captain profile info
  const [rideRequestData, setRideRequestData] = useState(null); // Ride data from server

  const navigate = useNavigate();

  // Fetch captain data on load
  useEffect(() => {
    const fetchCaptainData = async () => {
      try {
        const token = localStorage.getItem("capToken");
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/captions/profile`, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true
        });
        setCaptainData(res.data.caption);
      } catch (error) {
        console.error("Profile fetch error:", error.response?.data || error.message);
      }
    };
    fetchCaptainData();
  }, []);

  // Send location every 5 seconds
  useEffect(() => {
    const updateLocation = () => {
      if (navigator.geolocation && captainData._id) {
        navigator.geolocation.getCurrentPosition((position) => {
          const { latitude, longitude } = position.coords;
          socket.emit('update-location-captain', {
            captainId: captainData._id,
            location: { latitude, longitude }
          });
        });
      }
    };
    const locationInterval = setInterval(updateLocation, 5000);
    return () => clearInterval(locationInterval);
  }, [captainData]);

  // Listen for incoming ride requests
  useEffect(() => {
    socket.on('rideRequest', (rideData) => {
      setRideRequestData(rideData);
    });

    return () => {
      socket.off('rideRequest');
    };
  }, []);

  // Handle logout
  const handleLogOut = async () => {
    try {
      const token = localStorage.getItem('capToken');
      await axios.get(`${import.meta.env.VITE_API_URL}/captions/logout`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true
      });
      localStorage.removeItem('capToken');
      navigate('/');
    } catch (error) {
      console.log('Logout error:', error.response?.data || error.message);
    }
  };

  return (
    <div id="caption-home-page">
      {/* Background */}
      <div id="img-container">
        <img src="/Uber-map-design.gif" alt="uber-map" id="uber-map" />
      </div>

      {/* Logo & Logout */}
      <div id="logo-2">
        <img src="/uber-Logo-removebg-preview.png" alt="logo" className="logo-2" />
        <h1><MdLogout onClick={handleLogOut} /></h1>
      </div>

      {/* Captain Details */}
      <div className='Driver-working'>
        <div className='driver-info'>
          <div className='driver-pic-and-name'>
            <img src="/cute-anime-profile.jpg" alt="driver-pic" />
            <h2>{captainData?.fullname || "Captain"}</h2>
          </div>
          <div className='Price'>
            <h3>₹ 100</h3>
            <p>Per Ride</p>
          </div>
        </div>

        <div id='other-detail'>
          <div className='other-detail-item'><IoIosSpeedometer /><p>{captainData?.carType || "Honda City"}</p></div>
          <div className='other-detail-item'><MdAccessTimeFilled /><p>{captainData?.rating || "4.9"}</p></div>
          <div className='other-detail-item'><LuNotebook /><p>{captainData?.totalDistance || "5 km"}</p></div>
        </div>
      </div>

      {/* Show RidePopUp */}
      {rideRequestData && !showOtpPanel && (
        <RidePopUp 
          rideData={rideRequestData}
          onAccept={() => setShowOtpPanel(true)}
          onIgnore={() => setRideRequestData(null)}
        />
      )}

      {/* Show OTP Confirmation */}
      {showOtpPanel && rideRequestData && (
        <OptToConfirm rideData={rideRequestData} />
      )}
    </div>
  );
};

export default CaptionHomePage;
