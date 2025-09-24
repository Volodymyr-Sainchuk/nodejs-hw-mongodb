import express from 'express';
import ctrlWrapper from '../utils/ctrlWrapper';

import {
  getContacts,
  getContact,
  createContactController,
  updateContactController,
  deleteContactController,
} from '../controllers/contactsController';

const router = express.Router();

router.get('/', ctrlWrapper(getContacts));

router.get('/:id', ctrlWrapper(getContact));

router.post('/', ctrlWrapper(createContactController));

router.post('/:id', ctrlWrapper(updateContactController));

router.delete('/:id', ctrlWrapper(deleteContactController));

export default router;
