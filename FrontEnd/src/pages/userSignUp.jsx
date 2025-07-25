import '../styles/userSignUp.css';
import { useForm } from 'react-hook-form';
import { Link , useNavigate } from 'react-router-dom';
import axios from 'axios';
const UserSignUp = () => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();


  const navigate = useNavigate();

  const onSubmit = async (data) => {
      try {
    const response = await axios.post(`${import.meta.env.VITE_API_URL}/users/register`, data); // Make sure port matches your backend
   const token = response.data.token; // Assuming your backend returns a token
   localStorage.setItem('token', token); // Store token in localStorage
    console.log(response.data); // optional
    alert('User signed up successfully!');
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

      <form onSubmit={handleSubmit(onSubmit)} id='user-signup-form'>  
        <div className="form-group">
          <label htmlFor="fullname">Username:</label>
          <input type="text" id="username" {...register("fullname", {
            required: "fullname is required",
            minLength: { value: 3, message: 'Full name must be at least 3 characters long' }
          })} />
          {errors.username && <span>{errors.username.message}</span>}
        </div>
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
        <button type="submit">Sign Up</button>
      </form>

     <div id='login-link-container'>
       <label htmlFor="login-link">if you already have an account :</label>
      <Link to ="/UserLogin" className='login-link'>
        <button id='login-btn'>Login</button>
      </Link>
     </div>

        <div id='caption-signup'>
          <h1>SignUp as Caption <Link to="/captionSignup">here</Link></h1>
        </div>
</div>
    </>
  );
};

export default UserSignUp;
