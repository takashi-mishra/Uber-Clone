import React from 'react'
import { Route,Routes } from 'react-router-dom'
import { useEffect } from "react";
import { socket } from "./socket"; // Adjust path if needed
import axios from 'axios';

//pages and components
import Home from './pages/Home'
import UserLogin from './pages/UserLogin'
import UserSignUp from './pages/userSignUp'
import CaptionLogin from './pages/captionLogin'
import CaptionSignUp from './pages/captionSignUp'
import UserHomePage from './pages/userHomePage'
import CaptionHomePage from './pages/CaptionHomePage'
import PrivateRoute from './PrivateRoute';
import CaptionPrivateRoute from './CaptionPrivateRoute'
import PaymentPage from './pages/PaymentPage'
import CaptionRiding from './pages/CaptionRiding'
import UserRiding from './pages/UserRiding';
const App = () => {

// App.jsx
useEffect(() => {
  socket.once("connect", () => {
    console.log("✅ Socket connected from App.jsx:", socket.id);

    const token = localStorage.getItem("token") || localStorage.getItem("capToken"); // ✅ check both tokens
    const role = localStorage.getItem("userRole"); // 'user' or 'caption'

    if (token && role) {
      let apiUrl = "";

      // ✅ Choose correct API endpoint
      if (role === "user") {
        apiUrl = "http://localhost:3000/users/profile";
      } else if (role === "caption") {
        apiUrl = "http://localhost:3000/captions/profile";
      }

      axios.get(apiUrl, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }).then(res => {
        const user = res.data.user || res.data.caption; // handle both keys

        socket.emit("join", {
          userId: user._id,
          userType: role
        });

        console.log("📤 Sent socket join from App.jsx", {
          userId: user._id,
          userType: role
        });
      }).catch(err => {
        console.error("❌ Error fetching profile:", err.message);
      });
    }
  });
}, []);




  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/userLogin" element={<UserLogin />} />
        <Route path="/userSignUp" element={<UserSignUp />} />
        <Route path="/captionLogin" element={<CaptionLogin />} />
        
        <Route path="/captionSignUp" element={<CaptionSignUp />} />

        <Route element = {<CaptionPrivateRoute />} >
        <Route path="/captionHome" element={<CaptionHomePage />} />
        <Route path = "/captionRiding" element = {<CaptionRiding />}/>
        </Route>

          <Route element={<PrivateRoute />}>
          <Route path="/UserHome" element={<UserHomePage />} />
         <Route path = "/userRiding" element = {<UserRiding />}/>
          <Route path = "/payment" element = {<PaymentPage />}/>
         </Route>
        
      </Routes>
    </div>
  )
}

export default App
