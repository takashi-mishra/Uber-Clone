const http = require('http');
const app = require('./App'); // Import the Express application
const port = process.env.PORT || 8000; // Set the port to listen on
const {initializeSocket} = require('./socket'); // Import the socket initialization function

const server = http.createServer(app);
initializeSocket(server); // Initialize socket.io with the server

server.listen(port,() => {
    console.log(`Server is running on port ${port}`);
})
