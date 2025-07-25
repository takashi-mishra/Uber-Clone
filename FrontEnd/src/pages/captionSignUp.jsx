import React from 'react';
import { useForm} from 'react-hook-form';
import '../styles/CaptainRegisterForm.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'

export default function captionSignup() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  
    const navigate = useNavigate();
  
  const onSubmit = async (data) => {
     try {
  
    const CaptionResponse = await axios.post(`${import.meta.env.VITE_API_URL}/captions/register`, data);
    console.log(CaptionResponse.data);
    const token = CaptionResponse.data.token;
    localStorage.setItem('capToken', token);
    navigate('/captionHome');
    reset();
  } catch (error) {
    console.error("Registration error:", error.response?.data || error.message);
    alert(error.response?.data?.errors?.[0]?.msg || "Something went wrong");
  }
  };

  return (
    <div className="captain-form-wrapper">
      <h2>Captain Registration</h2>

      <form onSubmit={handleSubmit(onSubmit)}>

        <label>Full Name</label>
        <input
          type="text"
          {...register('fullname', { required: true, minLength: 3 })}
        />
        {errors.fullname && <p>Full name must be at least 3 characters</p>}

        <label>Email</label>
        <input
          type="email"
          {...register('email', { required: true, minLength: 5 })}
        />
        {errors.email && <p>Email must be at least 5 characters</p>}

        <label>Password</label>
        <input
          type="password"
          {...register('password', { required: true ,minLength: {value: 3, message: 'Password must be at least 3 characters long'}})}
        />
        {errors.password && <p>Password is required</p>}
        {errors.password?.type === 'minLength' && (
          <p>{errors.password.message}</p>
        )}

        <label>Status</label>
        <select {...register('Status')}>
          <option value="Offline">Offline</option>
          <option value="Online">Online</option>
          <option value="Away">Away</option>
        </select>

        <hr />
        <h3>Vehicle Details</h3>

        <label>Vehicle Color</label>
        <input
          type="text"
          {...register('vehicle.color', { required: true, minLength: 3 })}
        />
        {errors.vehicle?.color && <p>Color must be at least 3 characters</p>}

        <label>Capacity</label>
        <input
          type="number"
          {...register('vehicle.capacity', { required: true, min: 1 })}
        />
        {errors.vehicle?.capacity && <p>Minimum capacity is 1</p>}

        <label>Vehicle Type</label>
        <select {...register('vehicle.vehicleType', { required: true })}>
          <option value="">Select Type</option>
          <option value="Car">Car</option>
          <option value="Bike">Bike</option>
          <option value="Auto">Auto</option>
        </select>
        {errors.vehicle?.vehicleType && <p>Select vehicle type</p>}

        <label>Plate Number</label>
        <input
          type="text"
          {...register('vehicle.plateNumber', { required: true, minLength: 5 })}
        />
        {errors.vehicle?.plateNumber && <p>Plate number must be at least 5 characters</p>}

        <hr />
        <h3>Location (Optional)</h3>

        <label>Latitude</label>
        <input type="number" step="any" {...register('location.latitude')} />

        <label>Longitude</label>
        <input type="number" step="any" {...register('location.longitude')} />

        <button type="submit">Register Captain</button>
      </form>
      
      <div className="caption-Login-link">
        <h1>Already have an account? <a href="/captionLogin">Login here</a></h1> 
      </div>

    </div>
  );
}
