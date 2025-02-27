import express from 'express';
import createItem from '../controllers/Item/CreateItem.js';
import validateJWT from '../middlewares/validateJWT.js';
import deleteItem from '../controllers/Item/DeleteItem.js';

const router = express.Router();

router.post('/newItem', validateJWT, createItem);
router.delete('/:id', validateJWT, deleteItem);

export default router;
