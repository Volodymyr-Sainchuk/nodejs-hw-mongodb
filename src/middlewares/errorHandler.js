import { isHttpError } from 'http-errors';

// eslint-disable-next-line no-unused-vars
export default function errorHandler(error, req, res, next) {
  const status = isHttpError(error) ? error.statusCode : 500;

  res.status(status).json({
    status,
    message: error.message || 'Server error',
  });
}

// eslint-disable-next-line no-unused-vars
export function notFoundHandler(req, res, next) {
  res.status(404).json({
    status: 404,
    message: 'Route not found',
  });
}
