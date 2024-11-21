import express from 'express';
import { generate } from '../controllers/Ai';
const router = express.Router();

router.post('/generate', generate);

export default router;
