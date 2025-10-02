import express from 'express';

import {
  registerUserConroller,
  loginUserController,
  logoutUserController,
  refreshSessionController,
} from '../controllers/auth';

import { validateBody } from '../middlewares/validateBody';
import { registerSchema, loginSchema } from '../';

const router = express.Router();

router.post('/register', validateBody(registerSchema), registerUserConroller);

router.post('/login', validateBody(loginSchema), loginUserController);

router.post('/logout', logoutUserController);

router.post('/refresh', refreshSessionController);

export default router;
