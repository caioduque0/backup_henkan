import express from 'express';
import { createListRequest, getListRequestById, getListRequestsByList, updateSituation, deleteListRequest } from '../Controllers/listRequestController.js';

const router = express.Router();

router.post('/list-request', createListRequest);
router.put('/list-request/:ID', updateSituation);
router.delete('/list-request/:ID', deleteListRequest);
router.get('/list-request/:ID', getListRequestById);
router.get('/list-request/list/:ID', getListRequestsByList);

export default router;