import mongoose from 'mongoose';
import User from '../models/user.js';
import Video from '../models/video.js';
import { createError } from '../restFunctions/error.js';
import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

interface ReqWithUser extends Request {
    user?: {
        id: string
    }
}

const addVideoBodySchema = z.object({
    channelName: z.string().min(1),
    title: z.string().min(1),
    description: z.string().min(1),
    thumbnailURL: z.string().min(1),
    thumbnailName: z.string().min(1),
    videoURL: z.string().min(1),
    videoName: z.string().min(1),
    tags: z.array(z.string()).min(1)
})

type AddVideoBody = z.infer<typeof addVideoBodySchema>;

const updateVideoBodySchema = z.object({
    title: z.string().min(1).optional(),
    description: z.string().min(1).optional(),
    thumbnailURL: z.string().min(1).optional(),
    thumbnailName: z.string().min(1).optional(),
    videoURL: z.string().min(1).optional(),
    videoName: z.string().min(1).optional(),
    tags: z.array(z.string()).optional()
})

type UpdateVideoBody = z.infer<typeof updateVideoBodySchema>

export const addVideo = async (req: ReqWithUser, res: Response, next: NextFunction) => {
    if (!req.user) {
        return next(createError(403, 'You are not authorized...'));
    }
    try {
        const body: AddVideoBody = addVideoBodySchema.parse(req.body);
        const newVideo = new Video({userId: req.user.id, ...body});
        const savedVideo = await newVideo.save();
        res.status(200).json({savedViseo: savedVideo});
    }catch (err){
        if (err instanceof z.ZodError) {
            res.json({zodeError: err.issues[0].message});
            return;
        }
        next(err);
    }
}

export const updateVideo = async (req: ReqWithUser, res: Response, next: NextFunction) => {
    if (!req.user) {
        return next(createError(403, 'You are not authorized...'));
    }
    try{
        const video = await Video.findById(req.params.videoId);
        if(!video) return next(createError(401, 'Video not found'));
        if(video.userId === req.user.id) {
            const body: UpdateVideoBody = updateVideoBodySchema.parse(req.body);
            const updatedVideo = await Video.findByIdAndUpdate(req.params.videoId, {
                $set: body
            },
            {new: true});
            res.status(200).json(updatedVideo);
        }else {
            return next(createError(403, 'You can only update your own video'));
        }
    } catch (err) {
        next(err);
    }
}

export const deleteVideo = async (req: ReqWithUser, res: Response, next: NextFunction) => {
    if (!req.user) {
        return next(createError(403, 'You are not authorized...'));
    }
    try{
        const video = await Video.findById(req.params.videoId);
        if(!video) return next(createError(401, 'Video not found...'));
        if(video.userId === req.user.id) {
            await Video.findByIdAndDelete(req.params.videoId);
            const remainingVideos = await Video.find({userId: video.userId}).sort({createdAt: -1});
            if(remainingVideos){
                res.status(200).json(remainingVideos);
            }else {
                res.status(404).json('Nothing')
            }
        }else {
            return next(createError(403, 'You can only delete your own video...'));
        }
    }catch(err){
        next(err);
    }
}

export const getVideo = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const video = await Video.findById(req.params.videoId);
        if(!video) return next(createError(401, 'Video not found...'));
        res.status(200).json(video);
    }catch (err) {
        next(err)
    }
}

export const addView = async (req: Request, res: Response, next: NextFunction) => {
    try{
        await Video.findByIdAndUpdate(req.params.videoId, {
            $inc: {views: 1},
        }, {new: true});
        res.status(201).json('View added successfully...');
    }catch (err) {
        next(err);
    }
}

export const getAllVideos = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.userId;
    try {
        const userVideos = await Video.find({userId: userId}).sort({createdAt: -1});
        if (!userVideos || userVideos.length === 0) {
            return next(createError(404, 'No video Found...'));
        }
        res.status(201).json(userVideos);
    } catch (err) {
        next(err)
    }
}

export const random = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const randomVideos = await Video.aggregate([{$sample: {size: 40}}]);
        if (!randomVideos) return next(createError(500, 'An error occured, Please try later'));
        res.status(200).json(randomVideos);
    }catch (err) {
        next(err);
    }
}

export const trend = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const trendingVideos = await Video.find().sort({views: -1});
        res.status(200).json(trendingVideos);
    } catch (err) {
        next(err);
    }
}

export const sub = async (req: ReqWithUser, res: Response, next: NextFunction) => {
    if (!req.user) {
        return next(createError(403, 'You are not authorized...'));
    }
    try {
        const user = await User.findById(req.user.id);
        if(!user) {
            return next(createError(401, 'User not found...'));
        }
        const subscribedUsers = user.subscribedUsers;
        const subVideos = await Promise.all(
            subscribedUsers.map(async (channelId) => {
                return await Video.findOne({userId: channelId});
            })
        );

        
        res.status(200).json(subVideos.flat().sort((a, b) => {
            if (a && b) {
                return b.createdAt.getTime() - a.createdAt.getTime();
            } else if (!a && !b) {
                return 0; // Both are null
            } else if (!a) {
                return 1; // 'a' is null, 'b' is not null
            } else {
                return -1; // 'a' is not null, 'b' is null
            }
        })
        );
    } catch (err) {
        next(err);
    }
}

export const tags = async (req : Request, res: Response, next: NextFunction) => {
    if(!req.query.tag) {
        return next(createError(401, 'No tags found...'));
    }
    try {
        const tag = req.query.tag as string;
        const tagsArray = tag.split(',');
        const videos = await Video.find({ tags: {$in: tagsArray } });
        res.status(200).json(videos)
    } catch (err) {
        next(err);
    }
}

export const search = async (req: Request, res: Response, next: NextFunction) => {
    if(!req.query.q) {
        return next(createError(401, 'No search query found...'));
    }
    try {
        const query = req.query.q as string;
        const queryTags = query.split(' ');
        const videos = await Video.find({$or: [
            {title: {$regex: query, $options: 'i'}},
            {description: {$regex: query, $options: 'i'}},
            {tags: {$in: queryTags}}
        ]});
        res.status(200).json(videos);
    } catch (err) {
        next(err);
    }
}