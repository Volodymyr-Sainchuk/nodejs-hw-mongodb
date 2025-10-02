import express from 'express';

import authRoutes from './auth';
import contactRoutes from './contacts';

import { authenticate } from '../middlewares/authenticate';

const router = express.Router();

router.use('/authenticate', authRoutes);
router.use('./contacts', authenticate, contactRoutes);

export default router;
