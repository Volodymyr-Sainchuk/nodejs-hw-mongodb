import createHttpError from 'http-errors';
import { cloudinary } from '../utils/cloudinary.js';
import streamifier from 'streamifier';
import {
  getAllContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact,
} from '../services/contactsServices.js';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { parseFilterParams } from '../utils/parseFilterParams.js';

// === Helper to upload image to Cloudinary ===
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

export async function getContactsController(req, res, next) {
  try {
    const { page, perPage } = parsePaginationParams(req.query);
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

export async function getContactByIdController(req, res, next) {
  try {
    const { contactId } = req.params;
    const contact = await getContactById(contactId);

    if (!contact) {
      throw new createHttpError.NotFound('Contact not found');
    }

    res.status(200).json({
      status: 200,
      message: `Successfully found contact with id ${contactId}`,
      data: contact,
    });
  } catch (error) {
    next(error);
  }
}

export async function createContactController(req, res, next) {
  try {
    const { name, email, phone, favorite } = req.body;

    if (!req.user || !req.user._id) {
      return next(new createHttpError.Unauthorized('User not authenticated'));
    }

    if (!name || !email || !phone) {
      return next(
        createHttpError(400, 'Missing required fields: name, email, phone'),
      );
    }

    let photoUrl = null;

    if (req.file) {
      try {
        const result = await uploadToCloudinary(req.file.buffer);
        photoUrl = result.secure_url;
      } catch (cloudErr) {
        console.error('❌ Cloudinary upload failed:', cloudErr);
        return next(createHttpError(500, 'Image upload failed'));
      }
    }

    const newContact = await createContact({
      name,
      email,
      phone,
      favorite: favorite === 'true' || favorite === true,
      photo: photoUrl,
      userId: req.user._id,
    });

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
    const updateData = { ...req.body };

    if (req.file) {
      try {
        const result = await uploadToCloudinary(req.file.buffer);
        updateData.photo = result.secure_url;
      } catch (cloudErr) {
        console.error('❌ Cloudinary upload failed (PATCH):', cloudErr);
        return next(createHttpError(500, 'Image upload failed'));
      }
    }

    if (updateData.favorite !== undefined) {
      updateData.favorite =
        updateData.favorite === 'true' || updateData.favorite === true;
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
    const deletedContact = await deleteContact(contactId);

    if (!deletedContact) {
      throw new createHttpError.NotFound('Contact not found');
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
}
