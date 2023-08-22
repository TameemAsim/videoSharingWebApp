var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import Comment from '../models/comment.js';
import Video from '../models/video.js';
import { createError } from "../restFunctions/error.js";
export const getComments = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const comments = yield Comment.find({ videoId: req.params.videoId }).sort({ createdAt: -1 });
        res.status(200).json(comments);
    }
    catch (err) {
        next(err);
    }
});
export const addComment = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user) {
        return next(createError(403, 'You are not authorized...'));
    }
    try {
        const body = req.body;
        const comment = new Comment(Object.assign({ userId: req.user.id }, body));
        yield comment.save();
        res.status(201).json(comment);
    }
    catch (err) {
        next(err);
    }
});
export const deleteComment = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user) {
        return next(createError(403, 'You are not authorized...'));
    }
    try {
        const comment = yield Comment.findById(req.params.commentId);
        if (!comment) {
            return res.status(404).json('Comment not found...');
        }
        const videoId = comment.videoId;
        const video = yield Video.findById(videoId);
        if (!video) {
            return res.status(404).json('Video not found...');
        }
        if (req.user.id === video.userId || req.user.id === comment.userId) {
            yield Comment.findByIdAndDelete(req.params.commentId);
            res.status(202).json('Comment deleted successfully...');
        }
        else {
            res.status(403).json('You are not authorized to delete this comment.');
        }
    }
    catch (err) {
        next(err);
    }
});
