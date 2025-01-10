// productRoutes.ts
import express from 'express';
import { 
  getProducts,getExchangeRate
} from '../controllers/products'; // Adjust the path as needed

const router = express.Router();

router.get('/products', getProducts);
router.get('/exchange-rate/:currencyPair', getExchangeRate);

export default router;

