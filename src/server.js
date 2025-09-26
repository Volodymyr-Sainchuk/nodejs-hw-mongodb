import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import { initMongoConnection } from './db/initMongoConnection.js';
import errorHandler, { notFoundHandler } from './middlewares/errorHandler.js';
import contactsRoutes from './routers/contacts.js';

const PORT = process.env.PORT || 3000;

export default function setupServer() {
  initMongoConnection();
  const app = express();

  app.use(cors());
  app.use(pino());
  app.use(express.json());

  app.use('/contacts', contactsRoutes);

  app.get('/', (req, res) => {
    req.log.info('GET / called');
    res.send('main is here');
  });

  app.use(notFoundHandler);

  app.use(errorHandler);

  app.listen(PORT, (error) => {
    if (error) throw error;
    console.log(`Server is running on port ${PORT}`);
  });

  return app;
}
