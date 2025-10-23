import setupServer from './server.js';

async function start() {
  try {
    await setupServer();
    console.log('✅ Server started successfully');
  } catch (err) {
    console.error('❌ Failed to start server:', err);
    process.exit(1);
  }
}

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

start();
