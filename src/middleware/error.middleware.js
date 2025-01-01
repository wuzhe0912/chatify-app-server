import { AppError } from '../utils/error.utils.js';

export const errorHandler = (err, req, res, next) => {
  const statusCode = err instanceof AppError ? err.statusCode : 500;

  console.log('Global error handler', err);

  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal server error',
  });
};
