import React, { useState, useRef,useEffect } from 'react';
import '../styles/userHome.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import LocationData from '../Components/LocationData';
import { MdLogout } from "react-icons/md";
import { socket } from '../socket'; // adjust path as needed


const UserHomePage = () => {
  // UI state controls
  const [formClicked, setFormClicked] = useState(false);
  const [showLocationData, setShowLocationData] = useState(false);
  const [showVehicles, setShowVehicles] = useState(false);
  const[userdata , setUserData] = useState({})

  // Location & Destination inputs
  const [location, setLocation] = useState('');
  const [destination, setDestination] = useState('');
  const [activeField, setActiveField] = useState('');

  // Fare state
  const [fare, setFare] = useState({});

  // Refs for input elements
  const containerRef = useRef(null);
  const locationInputRef = useRef(null);
  const destinationInputRef = useRef(null);

  const navigate = useNavigate();

  // On confirm button click - updates UI states and fetches fare
  const handleConfirmBtnClick = async (e) => {
    e.preventDefault();
    setShowLocationData(true);
    setShowVehicles(true);
    await fetchFare(); // Call to fetch fare from backend
  };

  //fecthing user data
useEffect(() => {
  // Fetch user on mount
  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/users/profile`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true
      });
      setUserData(res.data.user);
      console.log("API response:", res.data.user);
    } catch (error) {
      console.error("Error fetching profile:", error.response?.data || error.message);
    }
  };

  fetchUserData();

  // ✅ Socket listener for rideStarted
  socket.on('rideStarted', (rideData) => {
    console.log('📲 Ride started received on user:', rideData);
    navigate('/userRiding');
  });

}, [navigate]);


  // Fetch fare from backend API
  const fetchFare = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/rides/get-fare`, {
        params: {
          pickup: location,
          destination: destination
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      console.log(response.data);
      setFare(response.data); // Store fare in state
    } catch (error) {
      console.error('Fare API Error:', error.response?.data || error.message);
    }
  };

  // Handle logout functionality
  const logingOut = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.get(`${import.meta.env.VITE_API_URL}/users/logout`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true
      });
      localStorage.removeItem('token');
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error.response?.data || error.message);
    }
  };

  // Set suggestion in input when clicked
  const handleSuggestionClick = (suggestion) => {
    if (activeField === 'location') {
      setLocation(suggestion);
      if (locationInputRef.current) locationInputRef.current.value = suggestion;
    } else if (activeField === 'destination') {
      setDestination(suggestion);
      if (destinationInputRef.current) destinationInputRef.current.value = suggestion;
    }
  };

 

  return (
    <div id="user-home-container" ref={containerRef}>
      {/* Header logo and logout */}
      <div id="logo">
        <img src="/uber-Logo-removebg-preview.png" alt="logo" className="logo-2" />
        <h1><MdLogout onClick={logingOut} /></h1>
      </div>

      {/* Map Image */}
      <div id="img-container">
        <img src="/Uber-map-design.gif" alt="uber-map" id="uber-map" />
      </div>

      {/* Location input form */}
      <div
        id="form-and-location-container"
        className={formClicked ? 'active' : ''}
        onClick={(e) => {
          e.preventDefault();
          setFormClicked(true);
          setShowLocationData(true);
        }}
      >
        <form id="enter-user-location-and-destination">
          <input
            type="text"
            placeholder="Enter your location"
            ref={locationInputRef}
            onChange={(e) => {
              setLocation(e.target.value);
              setActiveField('location');
            }}
          /> 
          <input
            type="text"
            placeholder="Enter your destination"
            ref={destinationInputRef}
            onChange={(e) => {
              setDestination(e.target.value);
              setActiveField('destination');
            }}
          />
          <button onClick={handleConfirmBtnClick}>Confirm</button>
        </form>

        {/* Location suggestions and vehicle list */}
        {showLocationData && (
          <LocationData
            location={location}
            destination={destination}
            activeField={activeField}
            onSuggestionSelect={handleSuggestionClick}
            showVehicles={showVehicles}
            Fare={fare} // Pass fare object as prop
            userdata = {userdata}
          />
        )}
      </div>
    </div>
  );
};

export default UserHomePage;
