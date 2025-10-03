import express from 'express';

import {
  registerUserConroller,
  loginUserController,
  logoutUserController,
  refreshSessionController,
} from '../controllers/auth.js';

import { validateBody } from '../middlewares/validateBody.js';
import { registerSchema, loginSchema } from '../../validation/auth.js';

const router = express.Router();

router.post('/register', validateBody(registerSchema), registerUserConroller);

router.post('/login', validateBody(loginSchema), loginUserController);

router.post('/logout', logoutUserController);

router.post('/refresh', refreshSessionController);

export default router;
