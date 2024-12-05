import express from 'express';
import { getUserHasList, getListsByUser } from '../Controllers/userHasListController.js';
const router = express.Router();

router.get('/user-list', getUserHasList);
router.get('/user-list/:user_id', getListsByUser);

export default router;