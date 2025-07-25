
import '../styles/userSignUp.css';
import { useForm } from 'react-hook-form';
import { Link,useNavigate } from 'react-router-dom';
import axios from 'axios';
const captionLogin = () => {

 const { register, handleSubmit, formState: { errors }, reset } = useForm();

 
  const navigate = useNavigate();
  const captionLogin = async (data) => {
 try {
    const captionLoginData = await axios.post(`${import.meta.env.VITE_API_URL}/captions/login`, data);
    console.log(captionLoginData)
     const token = captionLoginData.data.token;
    localStorage.setItem('capToken', token);
    localStorage.setItem("userRole", captionLoginData.data.caption.role); // ✅ set role in storage
    navigate('/captionHome')
    reset()
 } catch (error) {
    console.error("login error:", error.response?.data || error.message);
    alert(error.response?.data?.errors?.[0]?.msg || "Something went wrong");
 }
  };

  return (
    <>
           <div className="signup-container">

        <div id='uber-logo'>
            <img src="/uber-Logo-removebg-preview.png" alt="uber-logo" className='logo' />
        </div>

      <form onSubmit={handleSubmit(captionLogin)} id='user-signup-form'>  

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

  </div>
    </>
  )
}

export default captionLogin
