import express from 'express';
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import pino from 'pino-http';
import { initMongoConnection } from './db/initMongoConnection.js';
import errorHandler from './middlewares/errorHandler.js';
import router from './routers/index.js';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import path from 'path';

const PORT = process.env.PORT || 3000;

export default async function setupServer() {
  try {
    await initMongoConnection();
    console.log('✅ MongoDB connection established!');
  } catch (err) {
    console.error('❌ Failed to connect to MongoDB:', err);
    process.exit(1);
  }

  const app = express();

  app.use(cors());
  app.use(pino());
  app.use(express.json());
  app.use(cookieParser());

  app.use('/', router);

  app.get('/', (req, res) => {
    req.log.info('GET / called');
    res.send('Main API is here');
  });

  try {
    const swaggerDocument = YAML.load(
      path.join(process.cwd(), 'docs/openapi.yaml'),
    );
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
    console.log('✅ Swagger UI available at /api-docs');
  } catch (err) {
    console.error('❌ Failed to load Swagger documentation:', err);
  }

  app.use((req, res) => {
    res.status(404).json({ status: 404, message: 'Route not found' });
  });

  app.use(errorHandler);

  app.listen(PORT, (error) => {
    if (error) {
      console.error('❌ Server failed to start:', error);
      process.exit(1);
    }
    console.log(`✅ Server is running on port ${PORT}`);
  });

  return app;
}

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});
