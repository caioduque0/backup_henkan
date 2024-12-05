// listRoute.js
import express from 'express';
import { createList, getList, updateList, deleteList } from '../Controllers/listController.js';

const router = express.Router();

router.post('/list', createList);
router.get('/list/:ID', getList);
router.put('/list/:ID', updateList);
router.delete('/list/:ID', deleteList);

export default router;
