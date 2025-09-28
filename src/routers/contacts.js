import express from 'express';
import ctrlWrapper from '../utils/ctrlWrapper.js';

import {
  getContacts,
  getContact,
  createContactController,
  updateContactController,
  deleteContactController,
} from '../controllers/contacts.js';

const router = express.Router();

router.get('/', ctrlWrapper(getContacts));

router.get('/:id', ctrlWrapper(getContact));

router.post('/', ctrlWrapper(createContactController));

router.patch('/:id', ctrlWrapper(updateContactController));

router.delete('/:id', ctrlWrapper(deleteContactController));

export default router;
