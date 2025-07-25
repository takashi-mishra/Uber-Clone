import '../styles/userSignUp.css';
import { useForm } from 'react-hook-form';
import { Link,useNavigate } from 'react-router-dom';
import axios from 'axios'
const UserLogin = () => {

  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  const navigate = useNavigate()
  const dataSubmit = async (data) => {
        try {
    const response = await axios.post(`${import.meta.env.VITE_API_URL}/users/login`, data); // Make sure port matches your backend
  
    const token = response.data.token; // Assuming your backend returns a token
    localStorage.setItem('token', token); // Store token in localStorage
    localStorage.setItem("userRole", response.data.user.role); // ✅ set role in storage
 
    reset(); // reset form
    navigate('/userHome');
  } catch (error) {
    if (error.response && error.response.data) {
      alert(`Error: ${error.response.data.message || error.response.data.errors[0].msg}`);
    } else {
      alert('Something went wrong!');
    }
  }
  };

  return (
    <>
            <div className="signup-container">

        <div id='uber-logo'>
            <img src="/uber-Logo-removebg-preview.png" alt="uber-logo" className='logo' />
        </div>

      <form onSubmit={handleSubmit(dataSubmit)} id='user-signup-form'>  

        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input type="email" id="email" {...register("email", {
            required: "Email is required",
            minLength: { value: 5, message: 'Email must be at least 5 characters long' }
          })} />
          {errors.email && <span>{errors.email.message}</span>}
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input type="password" id="password" {...register("password", {
            required: "Password is required",
            minLength: { value: 3, message: 'Password must be at least 3 characters long' }
          })} />
          {errors.password && <span>{errors.password.message}</span>}
        </div>
        <button type="submit">Login</button>
      </form>

        <div id='caption-signup'>
          <h1>Login as Caption <Link to="/captionLogin">here</Link></h1>
        </div>
  </div>
    </>
  )
}

export default UserLogin
