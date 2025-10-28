import createHttpError from 'http-errors';
import { cloudinary } from '../utils/cloudinary.js';
import streamifier from 'streamifier';

import {
  getAllContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact,
} from '../services/contacts.js';

import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { parseFilterParams } from '../utils/parseFilterParams.js';

export async function getContacts(req, res) {
  try {
    const { page = 1, perPage = 10 } = parsePaginationParams(req.query) || {};
    const { sortBy, sortOrder } = parseSortParams(req.query);
    const filter = parseFilterParams(req.query);

    const contacts = await getAllContacts({
      page,
      perPage,
      sortBy,
      sortOrder,
      filter,
    });

    res.status(200).json({
      status: 200,
      message: 'Successfully found contacts!',
      data: contacts,
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
    const { contactId } = req.params;
    const contact = await getContactById(contactId);

    if (!contact) {
      return next(new createHttpError.NotFound('Contact not found'));
    }

    res.status(200).json({
      status: 200,
      message: `Successfully found contact with id ${contactId}!`,
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
    const { name, email, phone, isFavourite, contactType } = req.body;
    let photoUrl = null;

    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: 'contacts' },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          },
        );
        streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
      });

      photoUrl = result.secure_url;
    }

    const contact = await createContact({
      name,
      email,
      phone,
      isFavourite,
      contactType,
      photo: photoUrl,
      owner: req.user._id,
    });

    res.status(201).json({
      status: 201,
      message: 'Successfully created a contact!',
      data: contact,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateContactController(req, res, next) {
  try {
    const { contactId } = req.params;
    const updateData = { ...req.body };

    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: 'contacts' },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          },
        );
        streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
      });

      updateData.photo = result.secure_url;
    }

    const updatedContact = await updateContact(contactId, updateData);

    if (!updatedContact) {
      throw new createHttpError.NotFound('Contact not found');
    }

    res.status(200).json({
      status: 200,
      message: 'Successfully updated a contact!',
      data: updatedContact,
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteContactController(req, res, next) {
  try {
    const { contactId } = req.params;
    const contact = await deleteContact(contactId);

    if (!contact) {
      throw new createHttpError.NotFound('Contact not found');
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
}
