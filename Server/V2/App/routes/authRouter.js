import {Router} from 'express';

import AuthHandler from '../handler/authHandler.js';
// import { authenticateJWT } from '../middlewares/authMiddleware.js';
// import { generateAccessToken } from '../utils/jwtUtils.js';

const authRouter = Router();

// Public route for login
authRouter.post('/login',AuthHandler.login);
authRouter.post('/signup',AuthHandler.signup);



export default authRouter;
