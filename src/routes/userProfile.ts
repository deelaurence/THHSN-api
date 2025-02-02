import express from 'express';
import { 
    getAllUsers,
    getUserProfile
 } from '../controllers/userProfile';
import auth from '../middleware/authentication';
import adminAuth from '../middleware/adminAuthentication';

const router = express.Router();

 

router.get('/fetch', getUserProfile);
router.get('/fetch/all',adminAuth,getAllUsers);


export default router;
