import express from 'express';
import mongoose from 'mongoose';
import { authenticateToken } from './middlewares/auth.js';

import { Readable } from 'stream';
import { createGzip } from 'zlib';
import archiver from 'archiver';

const router = express.Router();

// Route to search texts
router.get('/search', authenticateToken, );

// Route to get folder by ID
router.get('/:folderId', authenticateToken, );

// Route to add a new folder
router.post('/:folderId/folder', authenticateToken, );
router.post('/:folderId/file', authenticateToken, );

// Route to get folder tree
router.get('/:folderId/tree', authenticateToken, );

// Route to download a folder as a ZIP
router.get('/:folderId/download', authenticateToken, );

//delete a folder
router.delete('/:folderId', authenticateToken,);


export default router;
