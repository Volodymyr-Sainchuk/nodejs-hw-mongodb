import Contact from '../models/contact.js';

export async function getAllContacts() {
  try {
    const contacts = await Contact.find();
    return contacts;
  } catch (error) {
    throw new Error('Error fetching contacts', error);
  }
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
