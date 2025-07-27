import React from 'react'
import '../styles/Home.css'
import { Link } from 'react-router-dom'
const Home = () => {
  return (
    <>
      <div id='home-continer'>
        <img src="/uber-light.png" alt="uber-light" id='main-img' />

        <div id='uber-logo'>
            <img src="/uber-Logo-removebg-preview.png" alt="uber-logo" className='logo' />
        </div>

        <div id='home-content'>
           <h1>Get Started with Uber</h1>
           <Link to = "/userSignUp" className='home-link'><button id='btn'>Continue</button></Link>
        </div>

      </div>
    </>
  )
}

export default Home
