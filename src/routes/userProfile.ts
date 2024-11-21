import express from 'express';
import { 
    getUserProfile
 } from '../controllers/userProfile';
import auth from '../middleware/authentication';

const router = express.Router();
router.use(auth)


router.get('/fetch', getUserProfile);


export default router;
