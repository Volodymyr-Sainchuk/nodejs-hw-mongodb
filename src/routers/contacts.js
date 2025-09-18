import express from 'express';
import ctrlWrapper from './utils/ctrlWrapper.js';

import {
  getContacts,
  getContact,
  createContactController,
  updateContactController,
  deleteContactController,
} from '../controllers/contactsController';

const router = express.Router();

router.get('/contacts', ctrlWrapper(getContacts));

router.get('/contacts/:contactId', ctrlWrapper(getContact));

router.post('/contacts', ctrlWrapper(createContactController));

router.post('/contacts/:contactId', ctrlWrapper(updateContactController));

router.delete('/contacts/:contactId', ctrlWrapper(deleteContactController));
