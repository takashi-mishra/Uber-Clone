# 🚖 Uber Clone App

A full-stack **Uber Clone Application** built using **MERN Stack** (MongoDB, Express.js, React.js, Node.js) with real-time ride booking, driver assignment, OTP verification, and location tracking features.

---

## 🌟 Features

- 🔐 User & Driver Authentication (JWT-based)
- 📍 Location Selection via Map API
- 🚕 Ride Request and Live Booking
- 🔄 Real-time Socket.IO communication
- 🧑‍✈️ Nearest Driver Assignment Logic
- ✅ OTP Verification before ride starts
- 📊 Ride History and Status Updates
- 💻 Responsive UI for both Rider and Driver

---

## 🔧 Tech Stack

**Frontend:**
- React.js (with Hooks & Context API)
- Tailwind CSS / CSS Modules
- Axios
- Map API Integration (e.g., OpenRouteService / Google Maps)

**Backend:**
- Node.js + Express.js
- MongoDB + Mongoose
- Socket.IO (Real-time communication)
- JSON Web Tokens (JWT)
- Dotenv for environment variables

---

## 🚀 Getting Started

### 📁 Folder Structure

Uber-Clone/
├── FrontEnd/ # React App
├── BackEnd/ # Node + Express API
├── .env # Environment Configs
└── README.md

bash
Copy
Edit

### 🛠️ Installation

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/Uber-Clone.git
cd Uber-Clone
Frontend Setup

bash
Copy
Edit
cd FrontEnd
npm install
npm start
Backend Setup

bash
Copy
Edit
cd ../BackEnd
npm install
npm run dev
Environment Variables

Create .env file in both FrontEnd and BackEnd (as required):

BackEnd .env example

ini
Copy
Edit
PORT=3000
MONGO_URI=mongodb://localhost:27017/Uber-Clone
JWT_SECRET=your_jwt_secret
MAPS_API_KEY=your_map_api_key
📸 Screenshots
Rider Panel	Driver Panel

📚 Key Functionalities Explained
Ride Booking Flow: Users select pickup and destination > Ride is requested > Nearest driver is notified via Socket.IO.

Driver Accept Flow: Driver sees request popup > Accepts > User gets confirmation > OTP screen shown.

OTP Validation: Driver enters OTP > Server verifies and starts ride.

Real-time Updates: All ride status changes (requested, confirmed, ongoing, completed) handled via web sockets.

🛠️ Future Enhancements
📱 Mobile App with React Native

💳 Payment Gateway Integration (Razorpay / Stripe)

🧠 AI-based fare estimation

📡 Live GPS tracking via WebSockets

📨 Push Notifications

👨‍💻 Developer
Yogesh Kumar Mishra
🌐 MERN Stack Developer | Designer | Passionate Creator
📧 Email: yogeshmishra4822@gmail.com

