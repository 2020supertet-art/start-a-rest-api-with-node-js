import { Router } from 'express';
import { tasksController } from '../controllers/tasks.controller.js';
import {
  validateCreateTask,
  validateUpdateTask,
  validatePatchTask,
} from '../middleware/validate.js';

const router = Router();

// Stats summary route (placed before :id route)
router.get('/stats/summary', tasksController.getStats);

// List and Create
router.get('/', tasksController.getTasks);
router.post('/', validateCreateTask, tasksController.createTask);

// Individual item operations
router.get('/:id', tasksController.getTaskById);
router.put('/:id', validateUpdateTask, tasksController.updateTask);
router.patch('/:id', validatePatchTask, tasksController.patchTask);
router.delete('/:id', tasksController.deleteTask);

export default router;
