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
console.log(PORT);

export default function setupServer() {
  initMongoConnection();
  const app = express();

  app.use(cors());
  app.use(pino());
  app.use(express.json());
  app.use(cookieParser());

  app.use('/', router);

  app.get('/', (req, res) => {
    req.log.info('GET / called');
    res.send('main is here');
  });
  const swaggerDocument = YAML.load(
    path.join(process.cwd(), 'docs/openapi.yaml'),
  );
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

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
