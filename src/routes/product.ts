// productRoutes.ts
import express from 'express';
import { 
  addProduct, 
  updateProductNameAndDescription, 
  updateProductBestsellerAndNewArrival,
  bestsellerAndNewArrivalCoverImage,
  updateProductImage, 
  updateProductVariation,
  deleteProduct, 
  getProduct, 
  setExchangeRate,
  updateExchangeRate,
  getProductDrafts,
  getProducts,
  getExchangeRate
} from '../controllers/products'; // Adjust the path as needed

import adminAuth from '../middleware/adminAuthentication';

import { upload,uploadAndConvertToWebp } from '../middleware/uploadPictures';

const router = express.Router();

// Route to add a new product
router.post('/product/add', adminAuth, addProduct);  

router.post('/exchange-rate/add', adminAuth, setExchangeRate);  
router.put('/exchange-rate/update', adminAuth, updateExchangeRate);  



// Route to edit a product by ID
router.put('/product/name-and-description/:id', adminAuth, updateProductNameAndDescription);

router.put('/product/variant/:id', adminAuth, updateProductVariation);

router.put('/product/bestseller-newarrival/:id', adminAuth, updateProductBestsellerAndNewArrival);

router.put('/product/bestseller-newarrival-coverimage/:id', adminAuth, bestsellerAndNewArrivalCoverImage);

// Route to edit a product image by ID (with max 10 images)
router.put('/product/image/:id', upload.array('images'), uploadAndConvertToWebp, updateProductImage);

// Route to delete a product by ID
router.delete('/products/:id', adminAuth, deleteProduct);

// Route to get a single product by ID
router.get('/products/:id', getProduct);





router.get('/products',adminAuth, getProducts);

router.get('/products-draft',adminAuth, getProductDrafts);

 
export default router;
