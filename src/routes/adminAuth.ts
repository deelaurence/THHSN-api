import express from 'express';
import {
  register,
  login,
  verifiedEmailPasswordReset,
  verifyEmailPasswordReset,
  updatePassword,
} from '../controllers/adminAuth';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/verify-email-password-reset', verifyEmailPasswordReset);
router.get('/verified-email-password-reset/:signature', verifiedEmailPasswordReset);
router.post('/update-password', updatePassword);

export default router;
