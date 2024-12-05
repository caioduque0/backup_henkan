import express from 'express';
import { createProduct, getProduct, updateProduct, deleteProduct } from '../Controllers/productController.js';

const router = express.Router();

router.post('/product', createProduct);
router.get('/product/:ID', getProduct);
router.put('/product/:ID', updateProduct);
router.delete('/product/:ID', deleteProduct);

export default router;