import express from 'express';
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import pino from 'pino-http';
import { initMongoConnection } from './db/initMongoConnection.js';
import errorHandler from './middlewares/errorHandler.js';
import router from './routers/index.js';

const PORT = process.env.PORT || 3000;

export default async function setupServer() {
  await initMongoConnection();

  const app = express();

  app.use(cors());
  app.use(pino());
  app.use(express.json());
  app.use(cookieParser());

  app.use('/', router);

  app.use((req, res) => {
    res.status(404).json({ status: 404, message: 'Route not found' });
  });

  app.use(errorHandler);

  app.listen(PORT, (error) => {
    if (error) throw error;
    console.log(`✅ Server is running on port ${PORT}`);
  });

  return app;
}

setupServer().catch((err) => {
  console.error('❌ Failed to start server:', err);
  process.exit(1);
});
