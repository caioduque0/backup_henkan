import express from 'express';
import { createUser, updateUser, getUser } from '../Controllers/userController.js';
const router = express.Router();

router.post('/user', createUser);
router.get('/user/:ID', getUser);
router.put('/user/:ID', updateUser);

export default router;