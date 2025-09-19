import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import { initMongoConnection } from './db/initMongoConnection.js';
import errrorHandler from './middlewares/errorHandler.js';
import studentRoutes from './routers/contacts.js';

const PORT = process.env.PORT || 3000;

export default function setupServer() {
  initMongoConnection();
  const app = express();
  app.use(cors());
  app.use(pino());
  app.use(express.json());

  app.use('/students', studentRoutes);

  app.get('/', (req, res) => {
    req.log.info('GET / called');
    res.send('main is here');
  });

  app.use(errrorHandler);

  app.use((req, res) => {
    res.status(404).json({ status: 404, message: 'Not found' });
  });

  app.listen(PORT, (error) => {
    if (error) throw error;
    console.log(`Server is running on port ${PORT}`);
  });

  return app;
}
