import Contact from '../models/contact.js';

export async function getAllContacts({
  page = 1,
  perPage = 10,
  sortBy = '_id',
  sortOrder = 'asc',
  filter = {},
  userId,
}) {
  const skip = (page - 1) * perPage;

  const contactsQuery = Contact.find({ ...filter, userId })
    .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
    .skip(skip)
    .limit(perPage);

  const [contacts, total] = await Promise.all([
    contactsQuery,
    Contact.countDocuments({ ...filter, userId }),
  ]);

  const totalPages = Math.ceil(total / perPage);

  return {
    data: contacts,
    page,
    perPage,
    totalItems: total,
    totalPages,
    hasPreviousPage: page > 1,
    hasNextPage: page < totalPages,
  };
}

export async function getContactById(contactId, userId) {
  return Contact.findOne({ _id: contactId, userId });
}

export async function createContact(payload, userId) {
  return Contact.create({ ...payload, userId });
}

export async function updateContact(contactId, payload, userId) {
  return Contact.findOneAndUpdate({ _id: contactId, userId }, payload, {
    new: true,
  });
}

export async function deleteContact(contactId, userId) {
  return Contact.findOneAndDelete({ _id: contactId, userId });
}
