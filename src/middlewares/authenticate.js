import createHttpError from 'http-errors';
import { Session } from '../models/session.js';
import { User } from '../models/user.js';

export async function authenticate(req, res, next) {
  const { authorization } = req.headers;

  if (!authorization) {
    return next(new createHttpError.Unauthorized('No authorization header'));
  }

  const [bearer, accessToken] = authorization.split(' ', 2);

  if (bearer !== 'Bearer' || !accessToken) {
    return next(
      new createHttpError.Unauthorized('Invalid authorization format'),
    );
  }

  const session = await Session.findOne({ accessToken });

  if (!session) {
    return next(new createHttpError.Unauthorized('Session not found'));
  }

  if (session.accessTokenValidUntil < new Date()) {
    return next(new createHttpError.Unauthorized('Access token is expired'));
  }

  const user = await User.findById(session.userId);
  if (!user) {
    return next(new createHttpError.Unauthorized('User not found'));
  }

  req.user = user;
  req.session = session;

  next();
}
