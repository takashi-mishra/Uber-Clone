import React from 'react'
import '../styles/captionHome.css'
import { MdLogout } from "react-icons/md";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CaptionRiding = () => {

    const navigate = useNavigate();

    const msgAlert = () => {
        alert('yupp you complete the Ride successfully');
        navigate('/captionHome');
    }
 const handleLogOut = async()=>{
     try {
    const token = localStorage.getItem('capToken'); // ✅ get token from storage
    console.log('Token:', token); // ✅ log the token to check if it's being retrieved correctly
    const Exit = await axios.get(`${import.meta.env.VITE_API_URL}/captions/logout`, {
      headers: {
        Authorization: `Bearer ${token}`  // ✅ SEND TOKEN HERE
      },
      withCredentials: true
    });

    console.log('Logout response:', Exit.data);
    localStorage.removeItem('capToken');
    navigate('/');
  } catch (error) {
    console.log('Error during logout:', error.response?.data || error.message);
  }
  }

  return (
    <>
      <div id="caption-home-page">
                  
              <div id="img-container">
                <img src="/Uber-map-design.gif" alt="uber-map" id="uber-map" />
              </div>
      
               <div id="logo-2">
                <img src="/uber-Logo-removebg-preview.png" alt="logo" className="logo-2" />
               <h1><MdLogout onClick={handleLogOut} /></h1> 
              </div>

              <div id='caption-riding'>
                <h2>Only 2 KM Away</h2>
                <button onClick={msgAlert}>Ride-Completed</button>
              </div>
    </div>
    </>
  )
}

export default CaptionRiding
