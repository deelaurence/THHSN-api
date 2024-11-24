// productRoutes.ts
import express from 'express';
import { 
  addProduct, 
  updateProduct, 
  updateProductImage, 
  updateProductVariation,
  deleteProduct, 
  getProduct, 
  getProducts
} from '../controllers/products'; // Adjust the path as needed

import adminAuth from '../middleware/adminAuthentication';

import { upload,uploadAndConvertToWebp } from '../middleware/uploadPictures';

const router = express.Router();

// Route to add a new product
router.post('/product/add', adminAuth, addProduct);  

// Route to edit a product by ID
router.put('/product/:id', adminAuth, updateProduct);

router.put('/product/variant/:id', adminAuth, updateProductVariation);

// Route to edit a product image by ID (with max 10 images)
router.put('/product/image/:id', upload.array('images'), uploadAndConvertToWebp, updateProductImage);

// Route to delete a product by ID
router.delete('/products/:id', adminAuth, deleteProduct);

// Route to get a single product by ID
router.get('/products/:id', getProduct);


router.get('/products', getProducts);

export default router;
