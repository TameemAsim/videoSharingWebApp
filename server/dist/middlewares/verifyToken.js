import jwt from 'jsonwebtoken';
import { createError } from '../restFunctions/error.js';
const verifyToken = (req, res, next) => {
    const token = req.cookies.access_token;
    if (!token) {
        return next(createError(401, 'You are not authorized'));
    }
    const JWTKEY = process.env.JWTKEY;
    if (!JWTKEY) {
        return next(createError(500, 'An error occured'));
    }
    jwt.verify(token, JWTKEY, (err, user) => {
        if (err) {
            return next(createError(403, 'Token is not valid...'));
        }
        req.user = user;
        next();
    });
};
export default verifyToken;
