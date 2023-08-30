var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import User from '../models/user.js';
import Video from '../models/video.js';
import { createError } from '../restFunctions/error.js';
import { z } from 'zod';
const addVideoBodySchema = z.object({
    channelName: z.string().min(1),
    title: z.string().min(1),
    description: z.string().min(1),
    thumbnailURL: z.string().min(1),
    thumbnailName: z.string().min(1),
    videoURL: z.string().min(1),
    videoName: z.string().min(1),
    tags: z.array(z.string()).min(1)
});
const updateVideoBodySchema = z.object({
    title: z.string().min(1).optional(),
    description: z.string().min(1).optional(),
    thumbnailURL: z.string().min(1).optional(),
    thumbnailName: z.string().min(1).optional(),
    videoURL: z.string().min(1).optional(),
    videoName: z.string().min(1).optional(),
    tags: z.array(z.string()).optional()
});
export const addVideo = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user) {
        return next(createError(403, 'You are not authorized...'));
    }
    try {
        const body = addVideoBodySchema.parse(req.body);
        const newVideo = new Video(Object.assign({ userId: req.user.id }, body));
        const savedVideo = yield newVideo.save();
        res.status(200).json(savedVideo);
    }
    catch (err) {
        if (err instanceof z.ZodError) {
            res.json({ zodeError: err.issues[0].message });
            return;
        }
        next(err);
    }
});
export const updateVideo = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user) {
        return next(createError(403, 'You are not authorized...'));
    }
    try {
        const video = yield Video.findById(req.params.videoId);
        if (!video)
            return next(createError(401, 'Video not found'));
        if (video.userId === req.user.id) {
            const body = updateVideoBodySchema.parse(req.body);
            const updatedVideo = yield Video.findByIdAndUpdate(req.params.videoId, {
                $set: body
            }, { new: true });
            res.status(200).json(updatedVideo);
        }
        else {
            return next(createError(403, 'You can only update your own video'));
        }
    }
    catch (err) {
        next(err);
    }
});
export const deleteVideo = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user) {
        return next(createError(403, 'You are not authorized...'));
    }
    try {
        const video = yield Video.findById(req.params.videoId);
        if (!video)
            return next(createError(401, 'Video not found...'));
        if (video.userId === req.user.id) {
            yield Video.findByIdAndDelete(req.params.videoId);
            const remainingVideos = yield Video.find({ userId: video.userId }).sort({ createdAt: -1 });
            if (remainingVideos) {
                res.status(200).json(remainingVideos);
            }
            else {
                res.status(404).json('Nothing');
            }
        }
        else {
            return next(createError(403, 'You can only delete your own video...'));
        }
    }
    catch (err) {
        next(err);
    }
});
export const getVideo = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const video = yield Video.findById(req.params.videoId);
        if (!video)
            return next(createError(401, 'Video not found...'));
        res.status(200).json(video);
    }
    catch (err) {
        next(err);
    }
});
export const addView = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield Video.findByIdAndUpdate(req.params.videoId, {
            $inc: { views: 1 },
        }, { new: true });
        res.status(201).json('View added successfully...');
    }
    catch (err) {
        next(err);
    }
});
export const getAllVideos = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.userId;
    try {
        const userVideos = yield Video.find({ userId: userId }).sort({ createdAt: -1 });
        if (!userVideos || userVideos.length === 0) {
            return next(createError(404, 'No video Found...'));
        }
        res.status(201).json(userVideos);
    }
    catch (err) {
        next(err);
    }
});
export const random = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const randomVideos = yield Video.aggregate([{ $sample: { size: 40 } }]);
        if (!randomVideos)
            return next(createError(500, 'An error occured, Please try later'));
        res.status(200).json(randomVideos);
    }
    catch (err) {
        next(err);
    }
});
export const trend = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const trendingVideos = yield Video.find().sort({ views: -1 });
        res.status(200).json(trendingVideos);
    }
    catch (err) {
        next(err);
    }
});
export const sub = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user) {
        return next(createError(403, 'You are not authorized...'));
    }
    try {
        const user = yield User.findById(req.user.id);
        if (!user) {
            return next(createError(401, 'User not found...'));
        }
        const subscribedUsers = user.subscribedUsers;
        const subVideos = yield Promise.all(subscribedUsers.map((channelId) => __awaiter(void 0, void 0, void 0, function* () {
            return yield Video.findOne({ userId: channelId });
        })));
        res.status(200).json(subVideos.flat().sort((a, b) => {
            if (a && b) {
                return b.createdAt.getTime() - a.createdAt.getTime();
            }
            else if (!a && !b) {
                return 0; // Both are null
            }
            else if (!a) {
                return 1; // 'a' is null, 'b' is not null
            }
            else {
                return -1; // 'a' is not null, 'b' is null
            }
        }));
    }
    catch (err) {
        next(err);
    }
});
export const tags = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.query.tag) {
        return next(createError(401, 'No tags found...'));
    }
    try {
        const tag = req.query.tag;
        const tagsArray = tag.split(',');
        const videos = yield Video.find({ tags: { $in: tagsArray } });
        res.status(200).json(videos);
    }
    catch (err) {
        next(err);
    }
});
export const search = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.query.q) {
        return next(createError(401, 'No search query found...'));
    }
    try {
        const query = req.query.q;
        const queryTags = query.split(' ');
        const videos = yield Video.find({ $or: [
                { title: { $regex: query, $options: 'i' } },
                { description: { $regex: query, $options: 'i' } },
                { tags: { $in: queryTags } }
            ] });
        res.status(200).json(videos);
    }
    catch (err) {
        next(err);
    }
});
