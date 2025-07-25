import React from 'react'
import '../styles/userHome.css';
import { FaShield } from "react-icons/fa6";
import { IoLocationSharp } from "react-icons/io5";
import { FaPhoneAlt } from "react-icons/fa";
import { FaHome } from "react-icons/fa";
import { Link } from 'react-router-dom';

const PaymentPage = () => {
  return (
    <>
    <div id="user-home-container">
        <div id="logo">
         <Link to='/UserHome' id='home-icon'><FaHome /></Link> 
        </div>

        <div id="img-container">
          <img src="/Uber-map-design.gif" alt="uber-map" id="uber-map" />
        </div>

     <div id='driver-detail-payment'>
                <div id='driver-info'>
                  <img src="/driver-pic.webp" alt="driver-profile" />
    
                  <div id='text-detail'>
                    <h4>Ankit</h4>
                    <h1>KA15AK00-0</h1>
                    <h3>white Suzuki S-Presso LXI</h3>
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
                    <strong>562/11-A</strong>
                    <p>Kaikondrahalli, Bengaluru, Karnataka</p>
                  </div>
                </div>
    
                <Link to ="/Payment" id='confirm-btn'>Make a payment</Link>
               </div>
              </div>
           
    </>
  )
}

export default PaymentPage
