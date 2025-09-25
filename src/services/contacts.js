import Contact from '../models/contact.js';

// export async function getAllContacts() {
//   try {
//     const contacts = await Contact.find();
//     return contacts;
//   } catch (error) {
//     throw new Error('Error fetching contacts', error);
//   }
// }

export async function getAllContacts({
  page = 1,
  perPage = 10,
  sortBy = '_id',
  sortOrder = 'asc',
  filter = {},
}) {
  const skip = (page - 1) * perPage;

  const contactsQuery = Contact.find(filter)
    .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
    .skip(skip)
    .limit(perPage);

  const [contacts, total] = await Promise.all([
    contactsQuery,
    Contact.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(total / perPage);

  return {
    data: contacts,
    total,
    page,
    perPage,
    totalPages,
    hasNextPage: totalPages > page,
    hasPreviousPage: page > 1,
  };
}

export async function getContactById(contactId) {
  try {
    const contact = await Contact.findById(contactId);
    return contact;
  } catch (error) {
    throw new Error('Error fetching contact by ID', error);
  }
}

export async function createContact(payload) {
  return Contact.create(payload);
}

export async function updateContact(contactId, payload) {
  return Contact.findByIdAndUpdate(contactId, payload, { new: true });
}

export async function deleteContact(contactId) {
  return Contact.findByIdAndDelete(contactId);
}
