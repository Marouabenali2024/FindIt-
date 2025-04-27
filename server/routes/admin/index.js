import express from 'express';
import {registerAdmin}  from '../admin/register.js';
import loginAdmin  from '../admin/Login.js';
import { banUser } from './BanUser.js';
import checkAuth from '../../middlewares/authMiddleware/checkAuth.js';
import checkAdmin from '../../middlewares/authMiddleware/checkAdmin.js';
import getUsers from '../admin/getUser.js';
import  getItems  from '../admin/getItem.js';
import deleteItem from '../admin/deleteItem.js';
import addSubAdmin from '../admin/addSubAdmin.js'; 
import removeSubAdmin from '../admin/removeSubAdmin.js';
import updateInfo  from '../admin/updateInfo.js';
import deleteComment from '../admin/deleteComment.js';

const router = express.Router();

// Admin registration
router.post('/register', registerAdmin);

// Admin login
router.post('/login', loginAdmin);

// Ban a user
router.put('/ban-user/:id', checkAuth, checkAdmin, banUser);

// Get all users
router.get('/users', checkAuth, checkAdmin, getUsers);

// Get all items
router.get('/items', checkAuth, checkAdmin, getItems);

// Delete an item
router.delete('/deleteItem/:id', checkAuth, checkAdmin, deleteItem);

// Add a sub-admin
router.post('/addSubAdmin', checkAuth, checkAdmin, addSubAdmin);

// Remove a sub-admin
router.delete('/removeSubAdmin/:id', checkAuth, checkAdmin, removeSubAdmin);

// Update admin information
router.put('/update/:id', checkAuth, checkAdmin, updateInfo);

// Delete a comment
router.delete('/deleteComment/:id', checkAuth, checkAdmin, deleteComment);

export default router;
