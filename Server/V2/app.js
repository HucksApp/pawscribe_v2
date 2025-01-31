import express from 'express';
import cors from 'cors';
import Config from './App/config/config.js';
import { connectDB } from './App/db/db.js';
// import makeCelery from './extensions/celery';
import mainRouter from './App/routes/mainRouter.js';
import { configSocket } from './App/Transport/dataSocket.js';
import ExecutionHandlers from './App/handler/execHandler.js';
import BroadcastExecutionHandlers from './App/handler/broadcastHandler.js';
import { allowedOrigins } from './App/constants/allowedExtensions.js';

// Helper function to create and configure the Express and Socket.IO app
export const createSocketApp = () => {
    const app = express();
    
    // Load application config
    app.set('config', Config);

    connectDB()

    // Enable CORS for all routes
    app.use(cors({
        origin: function(origin, callback) {
          if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
          } else {
            callback(new Error('Not allowed by CORS'));
          }
        },
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        credentials: true,
      }));


    app.use(express.json({ limit: Config.MAX_CONTENT_LENGTH }));
    app.use(express.urlencoded({ extended: true }));

    // Initialize external modules
    // makeCelery(app);

    // Register version 2 routes
    app.get('/', (req, res)=>{
        res.status(200).json({message: " pawscribe health check"})
    })
    app.use('/Api/v2', mainRouter);

    const { server, io } = configSocket(app)
    ExecutionHandlers.initSocket(io)
    BroadcastExecutionHandlers.initSocket(io)
    // Set up WebSocket support
    // app.listen(Config.port || 3000, () => {
    //     console.log(`Server running on port ${Config.port || 3000}`);
    // });

    return {app, server, io}
};
