import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js'; // Assuming a similar structure to your MongoDB User schema
import { File } from '../models/File.js';
import { Text } from '../models/Text.js';
import { authenticateToken } from '../middleware/authenticateToken.js'; // Middleware for JWT authentication
import mongoose from 'mongoose';

const router = express.Router();

// Route: Get User Profile
router.get('/user', authenticateToken, );

// Route: Get User Stats
router.get('/user/stats', authenticateToken, );

export default router;
