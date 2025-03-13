import express from 'express';
import { registerUser } from '../../routes/user/register.js';
import { loginUser } from '../../routes/user/Login.js';
import itemsRoutes from '../../routes/item/Itemsroutes.js'

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.use('/items', itemsRoutes); // Corrected to use itemsRoutes

export default router;
