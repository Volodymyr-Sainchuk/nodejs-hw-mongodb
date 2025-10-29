import setupServer from './server.js';

setupServer().catch((error) => {
  console.error('❌ Failed to start server:', error);
  process.exit(1);
});
