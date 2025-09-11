import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import { initMongoConnection } from './db/initMongoConnection.js';
import { getContacts, getContact } from './controllers/contactsController.js';

const PORT = process.env.PORT || 3000;

export default function setupServer() {
  initMongoConnection();
  const app = express();
  app.use(cors());
  app.use(pino());
  app.use(express.json());

  app.get('/', (req, res) => {
    req.log.info('GET / called');
    res.send('main is here');
  });

  app.get('/contacts', getContacts);

  app.get('/contacts/:contactId', getContact);

  app.use((req, res) => {
    res.status(404).json({ status: 404, message: 'Not found' });
  });

  app.listen(PORT, (error) => {
    if (error) throw error;
    console.log(`Server is running on port ${PORT}`);
  });

  return app;
}
