import 'dotenv/config';
import app from './app.js';

const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

const server = app.listen(PORT, () => {
  console.log(`===============================================`);
  console.log(`🚀 Node.js REST API Server running on port ${PORT}`);
  console.log(`📡 Environment: ${NODE_ENV}`);
  console.log(`🌐 Base URL: http://localhost:${PORT}`);
  console.log(`📖 API Explorer: http://localhost:${PORT}/api-docs`);
  console.log(`❤️  Health Check: http://localhost:${PORT}/api/health`);
  console.log(`📋 Tasks Endpoint: http://localhost:${PORT}/api/tasks`);
  console.log(`===============================================`);
});

// Graceful shutdown
function shutdown(signal) {
  console.log(`\nReceived ${signal}. Shutting down gracefully...`);
  server.close(() => {
    console.log('HTTP server closed. Exiting process.');
    process.exit(0);
  });

  // Force shutdown after 5 seconds if not closed
  setTimeout(() => {
    console.error('Forcefully terminating process.');
    process.exit(1);
  }, 5000);
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

export default server;
