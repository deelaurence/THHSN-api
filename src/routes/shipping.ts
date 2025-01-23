import express from 'express';
import adminAuth from '../middleware/adminAuthentication';
import {
  createShipping,
  getAllShipping,
  getAvailableShipping,
  getShippingById,
  updateShipping,
  deleteShipping,
} from '../controllers/shipping'; // Adjust the path as needed

const router = express.Router();
// Create a new shipping entry
router.post('/create', adminAuth, createShipping); 


router.get('/available',getAvailableShipping)

// Get all shipping entries
router.get('/', adminAuth, getAllShipping);

// Get a specific shipping entry by ID
router.get('/:id', adminAuth,getShippingById);

// Update a specific shipping entry by ID
router.put('/:id',adminAuth, updateShipping);

// Delete a specific shipping entry by ID
router.delete('/:id',adminAuth, deleteShipping);

export default router;
