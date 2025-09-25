import express from 'express';
import ctrlWrapper from '../utils/ctrlWrapper.js';

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
  ctrlWrapper(createContactController),
);

router.patch(
  '/:id',
  validateBody(updateContactSchema),
  isValidId,
  ctrlWrapper(updateContactController),
);

router.delete('/:id', isValidId, ctrlWrapper(deleteContactController));

export default router;
