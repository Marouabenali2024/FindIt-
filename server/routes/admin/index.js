import express from 'express';
import { registerAdmin } from './register.js';
import { loginAdmin } from './Login.js';
import { banUser } from './BanUser.js';
const router = express.Router();

router.post('/register', registerAdmin);
router.post('/login', loginAdmin);
router.put('/ban-user/:id', banUser);


export default router;
