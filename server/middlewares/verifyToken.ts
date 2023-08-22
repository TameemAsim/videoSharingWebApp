import jwt, { JsonWebTokenError } from 'jsonwebtoken';
import { createError } from '../restFunctions/error.js';
import { Request, Response, NextFunction } from 'express';

interface ReqWithUser extends Request {
    user?: {
        id: string
    }
}

const verifyToken = (req: ReqWithUser, res: Response, next: NextFunction) => {
  const token = req.cookies.access_token;

  if (!token) {
    return next(createError(401, 'You are not authorized'));
  }

  const JWTKEY = process.env.JWTKEY

  if(!JWTKEY) {
    return next(createError(500, 'An error occured'));
  }

  jwt.verify(token, JWTKEY, (err: any, user: any) => {
    if (err) {
      return next(createError(403, 'Token is not valid...'));
    }

    req.user = user;
    next();
  });
};

export default verifyToken;