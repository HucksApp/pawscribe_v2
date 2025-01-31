import { Router} from 'express';
import  AuthHandler  from '../handler/authHandler.js';





const fileRouter = Router();

// Public route for login
// fileRouter.post('/login',);

// Protected route
fileRouter.get('/protected', AuthHandler.authenticateJWT, (req, res) => {
    res.status(200).json({ message: 'Access granted to protected route', user: req.user });
});


// Search files route
fileRouter.get('/search', AuthHandler.authenticateJWT, );

// List all files
fileRouter.get('/all', AuthHandler.authenticateJWT, );

// Upload file
fileRouter.post('/upload', AuthHandler.authenticateJWT, );

// Get file by ID
fileRouter.get('/:fileId', AuthHandler.authenticateJWT,);

// Delete file by ID
fileRouter.delete('/:fileId', AuthHandler.authenticateJWT, );

// Download file
fileRouter.get('/download/:fileId', AuthHandler.authenticateJWT, );

export default fileRouter;

