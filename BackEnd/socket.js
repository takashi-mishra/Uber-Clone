const SocketIo = require('socket.io');

const userModel = require('./models/user.model');     // ✅ Change path as per your folder structure
const CaptionModel = require('./models/CaptinModel'); // ✅ Same here, adjust accordingly
let io;

function initializeSocket(server) {
    io = SocketIo(server, {
        cors: {
            origin: 'http://localhost:5173', // ✅ Use your frontend URL
            methods: ['GET', 'POST'],
            credentials: true
        }
    });

    io.on('connection', (socket) => {
        console.log(`new client connected : ${socket.id}`);

        socket.on('join',async (data) => {
            const {userId,userType} = data;
            if(userType === 'user'){
              await userModel.findByIdAndUpdate(userId, { socketId: socket.id });
            }else if(userType === 'caption'){
              await CaptionModel.findByIdAndUpdate(userId, { socketId: socket.id });
            }
        });

     socket.on('update-location-captain', async (data) => {

  const { captainId, location } = data;

  if (!captainId || !location?.latitude || !location?.longitude) {
    console.warn('⚠️ Invalid data received:', data);
    return;
  }

  const updatedCaptain = await CaptionModel.findByIdAndUpdate(
    captainId,
    {
      location: {
        type: 'Point', // ✅ THIS WAS MISSING
        coordinates: [location.longitude, location.latitude] // ✅ [lon, lat]
      }
    },
    { new: true }
  );


  io.emit('captainLocationUpdated', {
    captainId,
    location: {
      latitude: location.latitude,
      longitude: location.longitude
    }
  });
});


         // ✅ Add this block to handle ride request
        socket.on('rideRequest', (rideData) => {
    });

        socket.on('disconnect', () => {
            console.log('Client disconnected');
        });
    });
}

function sendMessageToSocketId(socketId, { event, data }) {
  if (io) {
    io.to(socketId).emit(event, data);
  } else {
    console.error('❌ Socket.io not initialized');
  }
}




module.exports = {
  initializeSocket,
  sendMessageToSocketId
};