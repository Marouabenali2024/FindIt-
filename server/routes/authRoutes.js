import express from 'express';

import createUser from '../controllers/User/CreateUser.js';
import loginUser from '../controllers/User/LoginUser.js';
import validateJWT from '../middlewares/validateJWT.js';

const router = express.Router();

router.post('/register', createUser);
router.post('/login', loginUser);
router.get('/protected', validateJWT, (req, res) => {
  res.json({ message: 'This is a protected route', user: req.user });
});

export default router;
