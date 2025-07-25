import React, { useEffect, useState } from 'react';
import '../styles/userHome.css';
import { FaShield } from "react-icons/fa6";
import { IoLocationSharp } from "react-icons/io5";
import { FaPhoneAlt } from "react-icons/fa";

const WaitingforDriver = ({ ride, selectedVehicle }) => {
  const [driverAssigned, setDriverAssigned] = useState(false);

  // Auto-show driver if ride is accepted
  useEffect(() => {
    if (ride && ride.caption) {
      setDriverAssigned(true);
    }
  }, [ride]);

  const {
    pickup,
    destination,
    caption = {}, // driver data
    otp = "Not Available", // ✅ ride object se directly le lo
  } = ride || {};

 const {
  fullname: driverName = 'Not Assigned',
  vehicle: {
    vehicleType = 'Not Available',
    plateNumber = 'Not Available', // 👈 ye sirf fallback hai agar data na ho
  } = {},
} = caption || {};


  return (
    <div id='vhicalData'>
      {/* Step 1: Looking for driver */}
      {!driverAssigned && (
        <div id='loking-for-driver'>
          <h2 id='text'>Looking for a nearest Driver</h2>
          <div id='waiting'>
            <img src={selectedVehicle?.image || "/Uber-PNG-Photos.png"} alt="vehicle" id='confirm-vehical-imgh' />
            <h3>Few minutes away...</h3>
          </div>
          <div id='vehicle-details-container-confirm'>
            <div id='vehicle-details-confirm'>
              <h3>Vehicle</h3>
              <p>{selectedVehicle?.type}</p>
              <p>Distance: {selectedVehicle?.distance} km</p>
              <p>Duration: {selectedVehicle?.duration} mins</p>
            </div>
            <h3 id='price'>₹{selectedVehicle.price?.toFixed(2)}</h3>
          </div>
        </div>
      )}

      {/* Step 2: Driver Assigned */}
      {driverAssigned && (
        <div id='driver-detail'>
          <div id='driver-info'>
            <img src="/driver-pic.webp" alt="driver-profile" />
            <div id='text-detail'>
              <h2>Name : {driverName}</h2>
              <h3>Plate-No : {plateNumber}</h3> 
              <h3>vehicleType : {vehicleType}</h3>
              <h3>Otp : {String(otp)}</h3>
              
            </div>
          </div>

          <div id="action-bar">
            <div className="action-item">
              <div className="icon-circle"><FaShield /></div>
              <span>Safety</span>
            </div>
            <div className="action-item">
              <div className="icon-circle"><IoLocationSharp /></div>
              <span>Share my trip</span>
            </div>
            <div className="action-item">
              <div className="icon-circle"><FaPhoneAlt /></div>
              <span>Call driver</span>
            </div>
          </div>

          <div id="location-info">
            <div className="location-icon"><IoLocationSharp /></div>
            <div className="location-text">
              <strong>Pickup</strong>
              <p>{pickup}</p>
            </div>
          </div>

          <div id="location-info">
            <div className="location-icon"><IoLocationSharp /></div>
            <div className="location-text">
              <strong>Destination</strong>
              <p>{destination}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WaitingforDriver;
