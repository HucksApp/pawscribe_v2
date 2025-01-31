import jwt from 'jsonwebtoken';
import Config from '../config/config.js';
import User from '../Models/User.js';

 class AuthHandler {
    static emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,7}\b/;

    // Middleware to authenticate JWT
    static authorizeRest = (req, res, next) => {
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.split(' ')[1];

            jwt.verify(token, Config.JWT_SECRET_KEY, (err, user) => {
                if (err) {
                    return res.status(403).json({ message: 'Forbidden: Invalid or expired token' });
                }

                // Check if the token is about to expire
                const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
                const tokenExpiry = user.exp; // Token expiration time from payload

                if (tokenExpiry - currentTime < 60 * 10) { // Token expires in less than 10 minutes
                    const newAccessToken = AuthHandler.generateAccessToken(user);
                    res.setHeader('x-refresh-token', newAccessToken); // Send the new token in the response headers
                }

                req.user = user; // Attach the user data to the request object
                next();
            });
        } else {
            res.status(401).json({ message: 'Unauthorized: Token not provided' });
        }
    };

    static authorizeSocket  (socket, next) {
        try {
            const authHeader = socket.handshake.headers.authorization;
            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                return next(new Error('Unauthorized: Token not provided or invalid'));
            }
    
            const token = authHeader.split(' ')[1];
            jwt.verify(token, Config.JWT_SECRET_KEY, (err, user) => {
                if (err) {
                    return next(new Error('Forbidden: Invalid or expired token'));
                }
    
                // Check if the token is about to expire
                const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
                const tokenExpiry = user.exp; // Token expiration time from payload
    
                if (tokenExpiry - currentTime < 60 * 10) {
                    // Token expires in less than 10 minutes
                    const newAccessToken = jwt.sign(
                        { ...user }, 
                        Config.JWT_SECRET_KEY, 
                        { expiresIn: '1h' } // Adjust the expiration time as needed
                    );
                    socket.handshake.headers['x-refresh-token'] = newAccessToken; // Attach the new token to the handshake headers
                }
    
                socket.user = user; // Attach user data to the socket object
                next();
            });
        } catch (error) {
            next(new Error('Unauthorized: Invalid token or error occurred during authentication'));
        }
    };



    // Login function
    static login = async (req, res) => {
        console.log(req.body)
        const { email, password } = req.body;
        try {
            const user = await User.findByEmail(email); // Ensure async function
            if (!user) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }

            const isPasswordValid = await user.validatePassword(password); // Ensure password validation is async
            if (!isPasswordValid) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }

            // Generate tokens
            const accessToken = AuthHandler.generateAccessToken(user);
            const refreshToken = AuthHandler.generateRefreshToken(user);

            res.status(200).json({user, tokens:{ accessToken, refreshToken}});
        } catch (error) {
            res.status(500).json({ message: 'Internal Server Error', error: error.message });
        }
    }

    // Signup function
    static signup = async (req, res) => {
      
        try {
            const { username, email, password } = req.body;
            if (!username || !password || !email) {
                return res.status(400).json({ message: 'Missing data', valid: false });
            }
    
            if (!AuthHandler.emailRegex.test(email)) {
                return res.status(400).json({ message: 'Invalid Email', valid: false });
            }

            const existingUser = await User.findByEmail(email); // Ensure async function
            if (existingUser) {
                return res.status(401).json({ message: 'User already exists' });
            }

            const user = await User.createUser(username, email, password); // Ensure async function

            const accessToken = AuthHandler.generateAccessToken(user);
            const refreshToken = AuthHandler.generateRefreshToken(user);

            res.status(201).json({user, tokens:{ accessToken, refreshToken}});
        } catch (error) {
            res.status(500).json({ message: 'Internal Server Error', error: error.message });
        }
    }

    static refreshAccessToken = (req, res) => {
        const { refreshToken } = req.body;
    
        if (!refreshToken) {
          return res.status(401).json({ message: 'Refresh token is required' });
        }
    
        jwt.verify(refreshToken, Config.JWT_SECRET_KEY, (err, user) => {
          if (err) {
            return res.status(403).json({ message: 'Invalid or expired refresh token' });
          }
    
          const newAccessToken = AuthHandler.generateAccessToken(user);
          const newRefreshToken = AuthHandler.generateRefreshToken(user);
    
          res.status(200).json({
            tokens: {
              accessToken: newAccessToken,
              refreshToken: newRefreshToken,
            },
          });
        });
      };

    // Logout function - Clears the refresh token on client-side
    static logout = (req, res) => {
        res.clearCookie('refreshToken'); // Clears the refresh token from cookies
        res.status(200).json({ message: 'Logged out successfully' });
    }

    // Generate Access Token
    static generateAccessToken = (user) => {
        return jwt.sign(
            { id: user.id, email: user.email },
            Config.JWT_SECRET_KEY,
            { expiresIn: Config.JWT_ACCESS_TOKEN_EXPIRES }
        );
    };

    // Generate Refresh Token
    static generateRefreshToken = (user) => {
        return jwt.sign(
            { id: user.id, email: user.email },
            Config.JWT_SECRET_KEY,
            { expiresIn: Config.JWT_REFRESH_TOKEN_EXPIRES }
        );
    };
}


export default AuthHandler;