/**
 * Validation middlewares for Task REST API
 */

const ALLOWED_STATUSES = ['pending', 'in-progress', 'completed'];
const ALLOWED_PRIORITIES = ['low', 'medium', 'high'];

export function validateCreateTask(req, res, next) {
  const { title, status, priority, dueDate, tags } = req.body;
  const errors = [];

  if (!title || typeof title !== 'string' || !title.trim()) {
    errors.push('Field "title" is required and must be a non-empty string');
  } else if (title.trim().length > 120) {
    errors.push('Field "title" cannot exceed 120 characters');
  }

  if (status !== undefined && !ALLOWED_STATUSES.includes(status)) {
    errors.push(`Field "status" must be one of: ${ALLOWED_STATUSES.join(', ')}`);
  }

  if (priority !== undefined && !ALLOWED_PRIORITIES.includes(priority)) {
    errors.push(`Field "priority" must be one of: ${ALLOWED_PRIORITIES.join(', ')}`);
  }

  if (dueDate !== undefined && dueDate !== null) {
    const parsed = new Date(dueDate);
    if (isNaN(parsed.getTime())) {
      errors.push('Field "dueDate" must be a valid ISO 8601 date string');
    }
  }

  if (tags !== undefined && !Array.isArray(tags)) {
    errors.push('Field "tags" must be an array of strings');
  } else if (Array.isArray(tags)) {
    const invalidTag = tags.find((t) => typeof t !== 'string');
    if (invalidTag !== undefined) {
      errors.push('All items in "tags" must be strings');
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      error: {
        status: 400,
        message: 'Validation failed',
        details: errors,
      },
    });
  }

  next();
}

export function validateUpdateTask(req, res, next) {
  const { title, description, status, priority, dueDate, tags } = req.body;
  const errors = [];

  // PUT requires full object
  if (!title || typeof title !== 'string' || !title.trim()) {
    errors.push('Field "title" is required and must be a non-empty string');
  }

  if (status && !ALLOWED_STATUSES.includes(status)) {
    errors.push(`Field "status" must be one of: ${ALLOWED_STATUSES.join(', ')}`);
  }

  if (priority && !ALLOWED_PRIORITIES.includes(priority)) {
    errors.push(`Field "priority" must be one of: ${ALLOWED_PRIORITIES.join(', ')}`);
  }

  if (dueDate !== undefined && dueDate !== null) {
    const parsed = new Date(dueDate);
    if (isNaN(parsed.getTime())) {
      errors.push('Field "dueDate" must be a valid ISO 8601 date string');
    }
  }

  if (tags !== undefined && !Array.isArray(tags)) {
    errors.push('Field "tags" must be an array of strings');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      error: {
        status: 400,
        message: 'Validation failed',
        details: errors,
      },
    });
  }

  next();
}

export function validatePatchTask(req, res, next) {
  const { title, description, status, priority, dueDate, tags } = req.body;
  const errors = [];

  if (Object.keys(req.body).length === 0) {
    return res.status(400).json({
      success: false,
      error: {
        status: 400,
        message: 'Request body cannot be empty for PATCH update',
      },
    });
  }

  if (title !== undefined) {
    if (typeof title !== 'string' || !title.trim()) {
      errors.push('Field "title" must be a non-empty string');
    } else if (title.trim().length > 120) {
      errors.push('Field "title" cannot exceed 120 characters');
    }
  }

  if (description !== undefined && description !== null && typeof description !== 'string') {
    errors.push('Field "description" must be a string or null');
  }

  if (status !== undefined && !ALLOWED_STATUSES.includes(status)) {
    errors.push(`Field "status" must be one of: ${ALLOWED_STATUSES.join(', ')}`);
  }

  if (priority !== undefined && !ALLOWED_PRIORITIES.includes(priority)) {
    errors.push(`Field "priority" must be one of: ${ALLOWED_PRIORITIES.join(', ')}`);
  }

  if (dueDate !== undefined && dueDate !== null) {
    const parsed = new Date(dueDate);
    if (isNaN(parsed.getTime())) {
      errors.push('Field "dueDate" must be a valid ISO 8601 date string or null');
    }
  }

  if (tags !== undefined && !Array.isArray(tags)) {
    errors.push('Field "tags" must be an array of strings');
  } else if (Array.isArray(tags)) {
    const invalidTag = tags.find((t) => typeof t !== 'string');
    if (invalidTag !== undefined) {
      errors.push('All items in "tags" must be strings');
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      error: {
        status: 400,
        message: 'Validation failed',
        details: errors,
      },
    });
  }

  next();
}
