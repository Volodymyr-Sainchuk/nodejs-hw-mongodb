import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import { initMongoConnection } from './db/initMongoConnection.js';
import errrorHandler from './middlewares/errorHandler.js';
import router from './routers/index.js';

const PORT = process.env.PORT || 3000;

export default function setupServer() {
  initMongoConnection();
  const app = express();

  app.use(cors());
  app.use(pino());
  app.use(express.json());

  app.use('/', router);

  app.get('/', (req, res) => {
    req.log.info('GET / called');
    res.send('main is here');
  });

  app.use(errrorHandler);

  app.use(errrorHandler);

  app.listen(PORT, (error) => {
    if (error) throw error;
    console.log(`✅ Server is running on port ${PORT}`);
  });

  return app;
}
