import express from 'express';
import cors from 'cors';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { requestLogger } from './middleware/logger.js';
import { notFoundHandler, errorHandler } from './middleware/errorHandler.js';
import apiRoutes from './routes/api.routes.js';
import tasksRoutes from './routes/tasks.routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function createApp() {
  const app = express();

  // Core Middlewares
  app.use(cors());
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true, limit: '1mb' }));

  // Request logging (can be disabled during tests)
  if (process.env.NODE_ENV !== 'test') {
    app.use(requestLogger);
  }

  // Serve static UI / API explorer from public directory
  const publicDir = path.join(__dirname, 'public');
  app.use(express.static(publicDir));
  app.use('/api-docs', express.static(publicDir));

  // Mount API routes
  app.use('/api', apiRoutes);
  app.use('/api/tasks', tasksRoutes);

  // Catch-all 404 handler for undefined API routes
  app.use(notFoundHandler);

  // Central error handling middleware
  app.use(errorHandler);

  return app;
}

export default createApp();
