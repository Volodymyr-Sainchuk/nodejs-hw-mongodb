import express from 'express';
import ctrlWrapper from '../utils/ctrlWrapper.js';
import { upload } from '../middlewares/upload.js';

import {
  getContacts,
  getContact,
  createContactController,
  updateContactController,
  deleteContactController,
} from '../controllers/contacts.js';

import { isValidId } from '../middlewares/isValidId.js';
import { validateBody } from '../middlewares/validateBody.js';

import {
  contactSchema,
  updateContactSchema,
} from '../../validation/contact.js';

const router = express.Router();

router.get('/', ctrlWrapper(getContacts));

router.get('/:id', isValidId, ctrlWrapper(getContact));

router.post(
  '/',
  validateBody(contactSchema),
  upload.single('photo'),
  ctrlWrapper(createContactController),
);

router.patch(
  '/:id',
  isValidId,
  validateBody(updateContactSchema),
  upload.single('photo'),
  ctrlWrapper(updateContactController),
);

router.delete('/:id', isValidId, ctrlWrapper(deleteContactController));

export default router;
