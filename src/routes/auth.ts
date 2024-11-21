import express from 'express';
import {
  register,
  login,
  deleteUser,
  verifyEmail,
  verifiedEmailPasswordReset,
  verifyEmailPasswordReset,
  updatePassword,
  updateUser,
  getUser,
} from '../controllers/userAuth';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.delete('/user/:email', deleteUser);
router.get('/verify-email/:signature', verifyEmail);
router.post('/verify-email-password-reset', verifyEmailPasswordReset);
router.get('/verified-email-password-reset/:signature', verifiedEmailPasswordReset);
router.post('/update-password', updatePassword);
router.put('/update-user', updateUser);
router.get('/get-user/:email', getUser);

export default router;
