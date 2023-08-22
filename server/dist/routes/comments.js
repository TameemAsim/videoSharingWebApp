import express from 'express';
import { addComment, deleteComment, getComments } from '../controllers/comment.js';
import verifyToken from '../middlewares/verifyToken.js';
const commentRoutes = express.Router();
commentRoutes.post('/', verifyToken, addComment);
commentRoutes.get('/:videoId', getComments);
commentRoutes.delete('/:commentId', verifyToken, deleteComment);
export default commentRoutes;
