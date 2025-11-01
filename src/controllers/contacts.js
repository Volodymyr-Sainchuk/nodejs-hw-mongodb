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

async function uploadToCloudinary(buffer) {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: 'contacts' },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      },
    );
    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
}

export async function getContacts(req, res, next) {
  try {
    const { page = 1, perPage = 10 } = parsePaginationParams(req.query) || {};
    const { sortBy, sortOrder } = parseSortParams(req.query);
    const filter = parseFilterParams(req.query);

    if (!req.user || !req.user._id) {
      return next(new createHttpError.Unauthorized('User not authenticated'));
    }

    const contacts = await getAllContacts({
      page,
      perPage,
      sortBy,
      sortOrder,
      filter,
      userId: req.user._id,
    });

    res.status(200).json({
      status: 200,
      message: 'Successfully found contacts!',
      data: contacts,
    });
  } catch (error) {
    next(error);
  }
}

export async function getContact(req, res, next) {
  try {
    const { contactId } = req.params;

    if (!req.user || !req.user._id) {
      return next(new createHttpError.Unauthorized('User not authenticated'));
    }

    const contact = await getContactById(contactId, req.user._id);

    if (!contact) {
      return next(new createHttpError.NotFound('Contact not found'));
    }

    res.status(200).json({
      status: 200,
      message: `Successfully found contact with id ${contactId}!`,
      data: contact,
    });
  } catch (error) {
    next(error);
  }
}

export async function createContactController(req, res, next) {
  try {
    const { name, email, phone, phoneNumber, isFavourite, contactType } =
      req.body;

    if (!req.user || !req.user._id) {
      return next(new createHttpError.Unauthorized('User not authenticated'));
    }

    const phoneVal = phoneNumber || phone;
    if (!name || !email || !phoneVal) {
      return next(
        new createHttpError.BadRequest(
          'Missing required fields: name, email, phoneNumber',
        ),
      );
    }

    let photoUrl = null;
    if (req.file && req.file.buffer) {
      try {
        const result = await uploadToCloudinary(req.file.buffer);
        photoUrl = result.secure_url;
      } catch (cloudErr) {
        console.error('Cloudinary upload failed:', cloudErr);
        return next(createHttpError(500, 'Image upload failed'));
      }
    }

    const payload = {
      name,
      email,
      phoneNumber: phoneVal,
      isFavourite: isFavourite === 'true' || isFavourite === true,
      contactType,
      photo: photoUrl,
    };

    const newContact = await createContact(payload, req.user._id);

    res.status(201).json({
      status: 201,
      message: 'Successfully created a contact!',
      data: newContact,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateContactController(req, res, next) {
  try {
    const { contactId } = req.params;
    const { phone, phoneNumber, isFavourite, ...rest } = req.body;

    if (!req.user || !req.user._id) {
      return next(new createHttpError.Unauthorized('User not authenticated'));
    }

    const updateData = { ...rest };

    if (phoneNumber !== undefined || phone !== undefined) {
      updateData.phoneNumber = phoneNumber ?? phone;
    }

    if (isFavourite !== undefined) {
      updateData.isFavourite = isFavourite === 'true' || isFavourite === true;
    }

    if (req.file && req.file.buffer) {
      try {
        const result = await uploadToCloudinary(req.file.buffer);
        updateData.photo = result.secure_url;
      } catch (cloudErr) {
        console.error('Cloudinary upload failed (PATCH):', cloudErr);
        return next(createHttpError(500, 'Image upload failed'));
      }
    }

    const updatedContact = await updateContact(
      contactId,
      updateData,
      req.user._id,
    );

    if (!updatedContact) {
      return next(new createHttpError.NotFound('Contact not found'));
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

    if (!req.user || !req.user._id) {
      return next(new createHttpError.Unauthorized('User not authenticated'));
    }

    const deleted = await deleteContact(contactId, req.user._id);

    if (!deleted) {
      return next(new createHttpError.NotFound('Contact not found'));
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
}
