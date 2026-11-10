import crypto from 'node:crypto';

// Initial seed data for demonstration
const initialTasks = [
  {
    id: 't-1001',
    title: 'Initialize Node.js REST API Architecture',
    description: 'Set up Express server with modular routing, middleware, controllers, and services.',
    status: 'completed',
    priority: 'high',
    tags: ['backend', 'nodejs', 'architecture'],
    dueDate: new Date(Date.now() + 86400000).toISOString(),
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 't-1002',
    title: 'Implement CRUD operations and Input Validation',
    description: 'Add GET, POST, PUT, PATCH, DELETE endpoints with input validation middleware.',
    status: 'in-progress',
    priority: 'high',
    tags: ['express', 'crud', 'validation'],
    dueDate: new Date(Date.now() + 86400000 * 2).toISOString(),
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 't-1003',
    title: 'Write Automated Test Suite',
    description: 'Cover all REST endpoints with integration tests using Node test runner.',
    status: 'pending',
    priority: 'medium',
    tags: ['testing', 'qa', 'supertest'],
    dueDate: new Date(Date.now() + 86400000 * 3).toISOString(),
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 't-1004',
    title: 'Build Interactive API Documentation & Explorer',
    description: 'Create a clean, responsive UI so users can test endpoints right from the browser.',
    status: 'pending',
    priority: 'low',
    tags: ['ui', 'docs', 'frontend'],
    dueDate: new Date(Date.now() + 86400000 * 4).toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

class TasksService {
  constructor() {
    this.tasks = JSON.parse(JSON.stringify(initialTasks));
  }

  // Reset to initial seed (useful for testing)
  reset(seed = initialTasks) {
    this.tasks = JSON.parse(JSON.stringify(seed));
  }

  /**
   * List tasks with filtering, search, sorting, and pagination
   */
  getAll({ status, priority, search, tag, sortBy = 'createdAt', sortOrder = 'desc', page = 1, limit = 10 } = {}) {
    let result = [...this.tasks];

    // Filter by status
    if (status) {
      result = result.filter((t) => t.status.toLowerCase() === status.toLowerCase());
    }

    // Filter by priority
    if (priority) {
      result = result.filter((t) => t.priority.toLowerCase() === priority.toLowerCase());
    }

    // Filter by tag
    if (tag) {
      result = result.filter((t) => Array.isArray(t.tags) && t.tags.includes(tag.toLowerCase()));
    }

    // Search query across title and description
    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          (t.description && t.description.toLowerCase().includes(q))
      );
    }

    // Sorting
    const validSortKeys = ['createdAt', 'updatedAt', 'title', 'dueDate', 'priority', 'status'];
    const sortKey = validSortKeys.includes(sortBy) ? sortBy : 'createdAt';
    const direction = sortOrder.toLowerCase() === 'asc' ? 1 : -1;

    result.sort((a, b) => {
      const valA = a[sortKey] || '';
      const valB = b[sortKey] || '';
      if (valA < valB) return -1 * direction;
      if (valA > valB) return 1 * direction;
      return 0;
    });

    // Pagination
    const parsedPage = Math.max(1, parseInt(page, 10) || 1);
    const parsedLimit = Math.max(1, Math.min(100, parseInt(limit, 10) || 10));
    const totalItems = result.length;
    const totalPages = Math.ceil(totalItems / parsedLimit) || 1;
    const startIndex = (parsedPage - 1) * parsedLimit;
    const paginatedItems = result.slice(startIndex, startIndex + parsedLimit);

    return {
      data: paginatedItems,
      pagination: {
        totalItems,
        totalPages,
        currentPage: parsedPage,
        limit: parsedLimit,
        hasNextPage: parsedPage < totalPages,
        hasPrevPage: parsedPage > 1,
      },
    };
  }

  /**
   * Find single task by ID
   */
  getById(id) {
    return this.tasks.find((t) => t.id === id) || null;
  }

  /**
   * Create a new task
   */
  create({ title, description = '', status = 'pending', priority = 'medium', tags = [], dueDate = null }) {
    const newTask = {
      id: `t-${crypto.randomUUID().slice(0, 8)}`,
      title: title.trim(),
      description: (description || '').trim(),
      status,
      priority,
      tags: Array.isArray(tags) ? tags.map((t) => String(t).trim().toLowerCase()).filter(Boolean) : [],
      dueDate: dueDate || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.tasks.unshift(newTask);
    return newTask;
  }

  /**
   * Full update of a task (PUT)
   */
  update(id, { title, description = '', status = 'pending', priority = 'medium', tags = [], dueDate = null }) {
    const index = this.tasks.findIndex((t) => t.id === id);
    if (index === -1) return null;

    const existing = this.tasks[index];
    const updatedTask = {
      id: existing.id,
      title: title.trim(),
      description: (description || '').trim(),
      status,
      priority,
      tags: Array.isArray(tags) ? tags.map((t) => String(t).trim().toLowerCase()).filter(Boolean) : [],
      dueDate: dueDate || null,
      createdAt: existing.createdAt,
      updatedAt: new Date().toISOString(),
    };

    this.tasks[index] = updatedTask;
    return updatedTask;
  }

  /**
   * Partial update of a task (PATCH)
   */
  patch(id, fields) {
    const index = this.tasks.findIndex((t) => t.id === id);
    if (index === -1) return null;

    const existing = this.tasks[index];
    const updatedTask = {
      ...existing,
      ...fields,
      id: existing.id, // Immutable
      createdAt: existing.createdAt, // Immutable
      updatedAt: new Date().toISOString(),
    };

    if (fields.title) updatedTask.title = fields.title.trim();
    if (fields.description !== undefined) updatedTask.description = (fields.description || '').trim();
    if (Array.isArray(fields.tags)) {
      updatedTask.tags = fields.tags.map((t) => String(t).trim().toLowerCase()).filter(Boolean);
    }

    this.tasks[index] = updatedTask;
    return updatedTask;
  }

  /**
   * Delete task by ID
   */
  delete(id) {
    const index = this.tasks.findIndex((t) => t.id === id);
    if (index === -1) return null;

    const [deleted] = this.tasks.splice(index, 1);
    return deleted;
  }

  /**
   * Get statistics summary
   */
  getStats() {
    const total = this.tasks.length;
    const byStatus = {
      pending: 0,
      'in-progress': 0,
      completed: 0,
    };
    const byPriority = {
      low: 0,
      medium: 0,
      high: 0,
    };

    const now = new Date();
    let overdue = 0;

    for (const t of this.tasks) {
      if (byStatus[t.status] !== undefined) byStatus[t.status]++;
      if (byPriority[t.priority] !== undefined) byPriority[t.priority]++;
      if (t.dueDate && t.status !== 'completed' && new Date(t.dueDate) < now) {
        overdue++;
      }
    }

    return {
      total,
      byStatus,
      byPriority,
      overdue,
    };
  }
}

export const tasksService = new TasksService();
