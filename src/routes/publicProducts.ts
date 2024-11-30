// productRoutes.ts
import express from 'express';
import { 
  getProducts
} from '../controllers/products'; // Adjust the path as needed

const router = express.Router();

router.get('/products', getProducts);

export default router;
