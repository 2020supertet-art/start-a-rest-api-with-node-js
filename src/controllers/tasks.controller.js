import { tasksService } from '../services/tasks.service.js';

export const tasksController = {
  /**
   * GET /api/tasks
   */
  getTasks(req, res, next) {
    try {
      const { status, priority, search, tag, sortBy, sortOrder, page, limit } = req.query;
      const result = tasksService.getAll({ status, priority, search, tag, sortBy, sortOrder, page, limit });

      res.status(200).json({
        success: true,
        count: result.data.length,
        pagination: result.pagination,
        data: result.data,
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * GET /api/tasks/stats/summary
   */
  getStats(req, res, next) {
    try {
      const stats = tasksService.getStats();
      res.status(200).json({
        success: true,
        data: stats,
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * GET /api/tasks/:id
   */
  getTaskById(req, res, next) {
    try {
      const { id } = req.params;
      const task = tasksService.getById(id);

      if (!task) {
        return res.status(404).json({
          success: false,
          error: {
            status: 404,
            message: `Task with ID "${id}" was not found`,
          },
        });
      }

      res.status(200).json({
        success: true,
        data: task,
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * POST /api/tasks
   */
  createTask(req, res, next) {
    try {
      const newTask = tasksService.create(req.body);
      res.location(`${req.baseUrl}/${newTask.id}`);
      res.status(201).json({
        success: true,
        message: 'Task created successfully',
        data: newTask,
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * PUT /api/tasks/:id
   */
  updateTask(req, res, next) {
    try {
      const { id } = req.params;
      const updated = tasksService.update(id, req.body);

      if (!updated) {
        return res.status(404).json({
          success: false,
          error: {
            status: 404,
            message: `Task with ID "${id}" was not found`,
          },
        });
      }

      res.status(200).json({
        success: true,
        message: 'Task updated successfully',
        data: updated,
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * PATCH /api/tasks/:id
   */
  patchTask(req, res, next) {
    try {
      const { id } = req.params;
      const patched = tasksService.patch(id, req.body);

      if (!patched) {
        return res.status(404).json({
          success: false,
          error: {
            status: 404,
            message: `Task with ID "${id}" was not found`,
          },
        });
      }

      res.status(200).json({
        success: true,
        message: 'Task partially updated successfully',
        data: patched,
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * DELETE /api/tasks/:id
   */
  deleteTask(req, res, next) {
    try {
      const { id } = req.params;
      const deleted = tasksService.delete(id);

      if (!deleted) {
        return res.status(404).json({
          success: false,
          error: {
            status: 404,
            message: `Task with ID "${id}" was not found`,
          },
        });
      }

      res.status(200).json({
        success: true,
        message: 'Task deleted successfully',
        data: {
          id: deleted.id,
          title: deleted.title,
        },
      });
    } catch (err) {
      next(err);
    }
  },
};
