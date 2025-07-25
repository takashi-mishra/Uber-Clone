import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaLocationDot } from "react-icons/fa6";
import '../styles/userHome.css';
import { socket } from '../socket';
import WaitingforDriver from './WaitingforDriver';

const LocationData = ({ location, destination, activeField, onSuggestionSelect, showVehicles, Fare, userdata }) => {
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState([]);
  const [confirmClicked, setConfirmClicked] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState({});
  const [showWaiting, setShowWaiting] = useState(false); // ✅ Show "Looking for Driver"
  const [rideAcceptedData, setRideAcceptedData] = useState(null); // ✅ When driver accepts ride
  

  // 🔄 Fetch suggestions as user types
  useEffect(() => {
    const fetchSuggestions = async (input, setFunc) => {
      if (!input || input.trim().length < 2) return;
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/maps/get-suggestions?input=${encodeURIComponent(input)}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            withCredentials: true,
          }
        );
        setFunc(res.data.suggestions || []);
      } catch (err) {
        console.error("❌ Suggestion fetch error:", err.message);
        setFunc([]);
      }
    };

    fetchSuggestions(location, setLocationSuggestions);
    fetchSuggestions(destination, setDestinationSuggestions);
  }, [location, destination]);

  // ✅ Suggestion click handler to send selected text back to input
const handleSuggestionClick = (suggestion) => {
  onSuggestionSelect(suggestion);
};


  // 🟡 Step 1: User selects vehicle
  const handleConfirmClick = async (vehicleType, imageSrc, price) => {
    setSelectedVehicle({
    type: vehicleType,
    image: imageSrc,
    price: price,
    distance: Fare.distance,      // ✅ Make sure this exists
    duration: Fare.duration       // ✅ Make sure this exists
  });
  setConfirmClicked(true);
  };

  useEffect(() => {
  console.log("🟢 Updated selectedVehicle:", selectedVehicle);
}, [selectedVehicle]);


  // 🟢 Step 2: User confirms ride (POST + socket + UI trigger)
  const sendData = async () => {
    setShowWaiting(true); // Show "Looking for Driver" panel

    const rideData = {
      pickup: location,
      destination: destination,
      vehicleType: selectedVehicle.type
    };

    try {
      const token = localStorage.getItem("token");

      // 📦 1. Save ride to DB
      await axios.post(
        `${import.meta.env.VITE_API_URL}/rides/ride`,
        rideData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      // 📡 2. Emit ride request to backend
      socket.emit("rideRequest", {
        userId: userdata._id,
        userName: userdata.fullname,
        pickup: location,
        destination: destination,
        vehicleType: selectedVehicle.type,
        distance: selectedVehicle.distance,
        duration: selectedVehicle.duration,
        price: selectedVehicle.price,
        vehicleImage: selectedVehicle.image,
      });

    } catch (error) {
      console.error("❌ Ride booking failed:", error.response?.data || error.message);
    }
  };

  // 🎯 Step 3: Driver accepted the ride
  useEffect(() => {
    socket.on("rideConfirmed", (rideDataWithDriver) => {
      console.log("✅ Ride confirmed by driver:", rideDataWithDriver);
      setRideAcceptedData(rideDataWithDriver); // Now pass this to WaitingforDriver
    });
  }, []);

  return (
    <>
      {/* 🔻 Location Suggestions */}
      {(activeField === 'location' ? locationSuggestions : destinationSuggestions).map((s, idx) => (
        <div className="location-data" key={idx} onClick={() => handleSuggestionClick(s)}>
          <h1><FaLocationDot /></h1>
          <div id="location-data-text">
            <p><strong>Suggested {activeField}:</strong> {s}</p>
          </div>
        </div>
      ))}

      {/* 🔻 Vehicle Options */}
      <div id="location-data-vehicle" className={showVehicles ? 'active' : ''}>
        <div id="vehicle-details-container" onClick={() => handleConfirmClick('Car', '/Uber-PNG-Photos.png', Fare.fare?.car)}>
          <img src="/Uber-PNG-Photos.png" alt="uber-car" />
          <div id="vehicle-details">
            <h3>Vehicle</h3>
            <p>Car</p>
            <p>Registration No: DL 3C 1231</p>
          </div>
          <h3 id="price">₹{Fare.fare?.car?.toFixed(2)}</h3>
        </div>

        <div id="vehicle-details-container" onClick={() => handleConfirmClick('Bike', '/Uber_Moto_Orange_312x208_pixels_Mobile.webp', Fare.fare?.bike)}>
          <img src="/Uber_Moto_Orange_312x208_pixels_Mobile.webp" alt="uber-bike" />
          <div id="vehicle-details">
            <h3>Vehicle</h3>
            <p>Bike</p>
            <p>Registration No: DL 3C 1232</p>
          </div>
          <h3 id="price">₹{Fare.fare?.bike?.toFixed(2)}</h3>
        </div>

        <div id="vehicle-details-container" onClick={() => handleConfirmClick('Auto', '/Uber_Auto_558x372_pixels_Desktop.webp', Fare.fare?.auto)}>
          <img src="/Uber_Auto_558x372_pixels_Desktop.webp" alt="uber-auto" />
          <div id="vehicle-details">
            <h3>Vehicle</h3>
            <p>Auto</p>
            <p>Registration No: DL 3C 1233</p>
          </div>
          <h3 id="price">₹{Fare.fare?.auto?.toFixed(2)}</h3>
        </div>
      </div>

     

      {/* 🔻 Confirm Ride View */}
      <div id="location-data-vehicle-confirm" className={confirmClicked ? 'activate' : ''}>
        <h2 id="text">Please Confirm Your Ride</h2>
        <img src={selectedVehicle.image} alt="uber-confirm" id="confirm-vehical-imgh" />
        <div id="vehicle-details-container-confirm">
          <div id="vehicle-details-confirm">
            <h3>Vehicle</h3>
            <p>{selectedVehicle.type}</p>
            <p>Distance: {selectedVehicle.distance} km</p>
            <p>Duration: {selectedVehicle.duration} mins</p>
          </div>
          <h3 id="price">₹{selectedVehicle.price?.toFixed(2)}</h3>
        </div>
        <button onClick={sendData} id="confirm-btn">Confirm Ride</button>
      </div>

      {/* 🔻 Show waiting and driver details */}
      {showWaiting && (
        <WaitingforDriver ride={rideAcceptedData} selectedVehicle={selectedVehicle} />
      )}
    </>
  );
};

export default LocationData;
