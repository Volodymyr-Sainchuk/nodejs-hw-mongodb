import { isHttpError } from 'http-errors';

// eslint-disable-next-line no-unused-vars
export default function errrorHandler(error, req, res, next) {
  if (isHttpError(error)) {
    return res.status(error.statusCode).json({
      status: error.statusCode,
      message: 'Something went wrong',
      data: error.message || error,
    });
  }
}
