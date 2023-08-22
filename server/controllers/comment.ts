import { z } from 'zod';
import Comment from '../models/comment.js';
import Video from '../models/video.js';
import { createError } from "../restFunctions/error.js";
import { Request, Response, NextFunction } from 'express';

interface ReqWithUser extends Request {
    user?: {
        id: string
    }
}

const addCommentSchema = z.object({
    username: z.string().min(1),
    videoId: z.string().min(1),
    desc: z.string().min(1)
})

type AddCommentBody = z.infer<typeof addCommentSchema>


export const getComments = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const comments = await Comment.find({videoId: req.params.videoId}).sort({createdAt: -1});
        res.status(200).json(comments);
    } catch (err) {
        next(err);
    }
}

export const addComment = async (req: ReqWithUser, res: Response, next: NextFunction) => {
    if (!req.user) {
        return next(createError(403, 'You are not authorized...'));
    }
    try {
        const body: AddCommentBody = addCommentSchema.parse(req.body);
        const comment = new Comment({
            userId: req.user.id,
            ...body
        });
        await comment.save();
        res.status(201).json(comment);
    } catch (err) {
        next(err);
    }
}

export const deleteComment = async (req: ReqWithUser, res: Response, next: NextFunction) => {
    if (!req.user) {
        return next(createError(403, 'You are not authorized...'));
    }
    try {
        const comment = await Comment.findById(req.params.commentId);
        if (!comment) {
            return res.status(404).json('Comment not found...');
        }
        const videoId = comment.videoId;
        const video = await Video.findById(videoId);
        if(!video) {
            return res.status(404).json('Video not found...');
        }
        if (req.user.id === video.userId || req.user.id === comment.userId) {
            await Comment.findByIdAndDelete(req.params.commentId);
            res.status(202).json('Comment deleted successfully...');
        }else {
            res.status(403).json('You are not authorized to delete this comment.');
        }
    } catch (err) {
        next(err);
    }
}