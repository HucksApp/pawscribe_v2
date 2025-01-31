
import {createServer} from 'http';
import { Server } from "socket.io";


export const  configSocket = (app) => {

const server = createServer(app);
// Configure Socket.io options
const io = new Server(server, {
  // Define which transports to use (websockets, polling, etc.)
  transports: ['websocket', 'polling'],  // WebSocket and Polling (default is WebSocket)

  // Set the maximum number of connections the server can handle at once
  maxConnections: 1000,  // Default: Infinity

  // Enable or disable connection upgrade
  allowUpgrades: true,  // Default: true

  // Set the path for Socket.io's HTTP endpoint
  //path: '/socket.io',  // Default: '/socket.io'

  // Enable or disable CORS
  cors: {
    origin: '*',  // Allow any domain to connect (for testing)
    methods: ['GET', 'POST', 'DELETE', 'PUT'],
    allowedHeaders: ['my-custom-header'],
    credentials: true,
  },

  // Configure the heartbeat settings (pingInterval and pingTimeout)
  pingInterval: 25000,  // Time in ms between each "ping" from the server (default: 25000 ms)
  pingTimeout: 5000,    // Time in ms before considering the connection timed out (default: 5000 ms)
  pingMaxRetries: 3,    // Max number of retries before closing the connection (default: 3)

  // Enable or disable reconnection attempts
  reconnection: true,        // Allow clients to reconnect automatically if the connection is lost
  reconnectionAttempts: 10,  // Max number of reconnection attempts (default: Infinity)
  reconnectionDelay: 1000,   // Time (ms) between reconnection attempts (default: 1000 ms)
  reconnectionDelayMax: 5000, // Max delay between reconnection attempts (default: 5000 ms)
  randomizationFactor: 0.5,   // Randomization factor for reconnection delay (default: 0.5)

  // Enable or disable compression for WebSocket messages
  perMessageDeflate: {
    threshold: 1024,  // Message size threshold for enabling deflate compression (default: 1024 bytes)
  },

  // Enable or disable server-side event broadcasting and timeouts
  transportsOptions: {
    websocket: {
      // Enable or disable WebSocket compression
      compression: true,  // Default: true
    },
    polling: {
      // Max payload size for polling transport (default: 1MB)
      maxHttpBufferSize: 1e6, // 1MB
    },
  },

  // Configure the socket middleware (for authentication or other checks)
  allowRequest: (req, callback) => {
    // Custom logic to allow/deny socket connections
    const isAuthorized = true;  // Your authentication logic here
    if (isAuthorized) {
      callback(null, true);  // Allow connection
    } else {
      callback(new Error('Unauthorized'), false);  // Deny connection
    }
  },
});

return { server, io}

}