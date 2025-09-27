import createHttpError from 'http-errors';

import {
  getAllContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact,
} from '../services/contacts.js';

export async function getContacts(req, res) {
  try {
    const data = await getAllContacts();
    res.status(200).json({
      status: 200,
      message: 'Successfully found contacts!',
      data,
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: 'Server error',
      error: error.message,
    });
  }
}

export async function getContact(req, res, next) {
  try {
    const { id } = req.params;
    const contact = await getContactById(id);

    if (!contact) {
      return next(new createHttpError.NotFound('Contact not found'));
    }

    res.status(200).json({
      status: 200,
      message: `Successfully found contact with id ${id}!`,
      data: contact,
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: 'Server error',
      error: error.message,
    });
  }
}

export async function createContactController(req, res, next) {
  try {
    const contact = await createContact(req.body);

    res.status(201).json({
      status: 'success',
      code: 201,
      data: {
        contact: { contact },
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function updateContactController(req, res, next) {
  try {
    const contact = await updateContact(req.params.id, req.body);

    if (!contact) {
      throw new createHttpError.NotFound('Contact not found');
    }

    res.status(200).json({
      status: 200,
      message: 'Successfully updated a contact!',
      data: contact,
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteContactController(req, res, next) {
  try {
    const contact = await deleteContact(req.params.id);

    if (!contact) {
      throw new createHttpError.NotFound('Contact not found');
    }

    res.status(204).end();
  } catch (error) {
    next(error);
  }
}
