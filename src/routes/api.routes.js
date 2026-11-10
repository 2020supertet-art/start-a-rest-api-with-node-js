import { Router } from 'express';

const router = Router();

/**
 * Health check endpoint
 */
router.get('/health', (req, res) => {
  const memory = process.memoryUsage();
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    environment: process.env.NODE_ENV || 'development',
    memory: {
      rssMb: Math.round(memory.rss / 1024 / 1024 * 100) / 100,
      heapUsedMb: Math.round(memory.heapUsed / 1024 / 1024 * 100) / 100,
      heapTotalMb: Math.round(memory.heapTotal / 1024 / 1024 * 100) / 100,
    },
  });
});

/**
 * API Directory & Discovery
 */
router.get('/', (req, res) => {
  res.status(200).json({
    name: 'Node.js Tasks REST API',
    version: '1.0.0',
    description: 'RESTful API for task management with Node.js and Express',
    documentation: '/api-docs',
    endpoints: {
      health: {
        method: 'GET',
        url: '/api/health',
        description: 'Server health and system metrics',
      },
      listTasks: {
        method: 'GET',
        url: '/api/tasks',
        description: 'List tasks with filtering, search, sorting & pagination',
        queryParams: ['status', 'priority', 'tag', 'search', 'sortBy', 'sortOrder', 'page', 'limit'],
      },
      getStats: {
        method: 'GET',
        url: '/api/tasks/stats/summary',
        description: 'Get counts grouped by status and priority',
      },
      getTask: {
        method: 'GET',
        url: '/api/tasks/:id',
        description: 'Retrieve a single task by ID',
      },
      createTask: {
        method: 'POST',
        url: '/api/tasks',
        description: 'Create a new task',
        body: {
          title: 'string (required)',
          description: 'string (optional)',
          status: "'pending' | 'in-progress' | 'completed' (default: 'pending')",
          priority: "'low' | 'medium' | 'high' (default: 'medium')",
          tags: 'string[] (optional)',
          dueDate: 'ISO 8601 string (optional)',
        },
      },
      updateTask: {
        method: 'PUT',
        url: '/api/tasks/:id',
        description: 'Replace an entire task resource',
      },
      patchTask: {
        method: 'PATCH',
        url: '/api/tasks/:id',
        description: 'Partially update task fields',
      },
      deleteTask: {
        method: 'DELETE',
        url: '/api/tasks/:id',
        description: 'Delete a task by ID',
      },
    },
  });
});

export default router;
