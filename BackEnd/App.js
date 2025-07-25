const dotenv = require('dotenv');
dotenv.config(); // Load environment variables from .env file
const userRoutes = require('./routes/user.routes'); // Import user routes
const captionRoutes = require('./routes/captionRoute'); // Import caption routes
const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
app.use(cookieParser()); // Middleware to parse cookies from request headers
const mapsRoute = require('./routes/MapsRoute'); // Import maps routes
const rideRoutes = require('./routes/Ride'); // Import ride routes


const morgan = require('morgan'); // Import morgan for logging HTTP requests
app.use(morgan('dev')); // Use morgan middleware for logging in 'dev' format

const connectToDatabase = require('./DataBase/Db'); // Import the database connection function
connectToDatabase(); // Connect to the database

const cors = require('cors'); // Import CORS middleware
app.use(cors({
  origin: ["http://localhost:5173", "https://uber-clone-1-frontend.onrender.com"],
  credentials: true
}));

app.use(express.json()); // Middleware to parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Middleware to parse URL-encoded request bodies

app.get("/",(req,res)=>{
    res.send("Hello World");
})

app.use('/users', userRoutes); // Use user routes for API requests
app.use('/captions', captionRoutes); // Use caption routes for API requests
app.use('/maps', mapsRoute); // Use maps routes for API requests
app.use('/rides', rideRoutes); // Use ride routes for API requests

module.exports = app;
// This is the main application file for the Express.js server.