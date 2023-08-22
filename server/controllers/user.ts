import User from "../models/user.js";
import Video from '../models/video.js';
import { createError } from "../restFunctions/error.js";
import { Request, Response, NextFunction } from "express";
import bcrypt from 'bcrypt';
import { z } from "zod";

interface ReqWithUser extends Request {
    user?: {
        id: string
    }
}

const updateUserBodySchema = z.object({
    username: z.string().min(1).optional(),
    email: z.string().min(1).email().optional(),
    img: z.string().min(1).optional(),
    imgName: z.string().min(1).optional(),
    subscribers: z.string().min(1).optional(),
    subscribedUsers: z.array(z.string()).optional()
})

type UpdateUserBody = z.infer<typeof updateUserBodySchema>

const changePasswordBodySchema = z.object({
    password: z.string().min(6).max(15).refine((value) => {
        // Regular expressions to check for different character types
        const hasUppercase = /[A-Z]/.test(value);
        const hasLowercase = /[a-z]/.test(value);
        const hasNumber = /[0-9]/.test(value);
        const hasSpecialChar = /[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/.test(value);

        // Ensure all required conditions are met
        return hasUppercase && hasLowercase && hasNumber && hasSpecialChar;
    }, 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character')
})

type ChangePasswordBody = z.infer<typeof changePasswordBodySchema>;

export const update = async (req: ReqWithUser, res: Response, next: NextFunction) => {
    if (!req.user) {
        return next(createError(403, 'You are not authorized...'));
    }
    if (req.params.userId === req.user.id) {
        try {
            const body: UpdateUserBody = updateUserBodySchema.parse(req.body);
            const user = await User.findByIdAndUpdate(
                req.params.userId,
                {
                    $set: body,
                },
                { new: true }
            );
            if (!user) {
                return next(createError(401, 'User Not Found...'))
            }
            res.status(200).json({
                _id: user._id,
                username: user.username,
                email: user.email,
                subscribers: user.subscribers,
                subscribedUsers: user.subscribedUsers,
                img: user.img,
                imgName: user.imgName
            })
        } catch (err) {
            next(err);
        }
    } else {
        return next(createError(403, 'You can only update your own account...'));
    }
}

export const deletion = async (req: ReqWithUser, res: Response, next: NextFunction) => {
    if (!req.user) {
        return next(createError(403, 'You are not authorized...'));
    }
    if (req.params.userId === req.user.id) {
        try {
            await User.findByIdAndDelete(
                req.params.userId
            );
            res.status(200).json('User has been deleted')
        } catch (err) {
            next(err);
        }
    } else {
        return next(createError(403, 'You can only delete your own account...'));
    }
}

export const getUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) return next(createError(401, 'This user do not exist'));
        res.status(200).json({
            _id: user._id,
            username: user.username,
            email: user.email,
            subscribers: user.subscribers,
            subscribedUsers: user.subscribedUsers,
            img: user.img,
            imgName: user.imgName
        });
    } catch (err) {
        next(err)
    }

}

export const subscribe = async (req: ReqWithUser, res: Response, next: NextFunction) => {
    if (!req.user) {
        return next(createError(403, 'You are not authorized...'));
    }
    try {
        await User.findByIdAndUpdate(req.user.id, { $push: { subscribedUsers: req.params.userId } });
        await User.findByIdAndUpdate(req.params.userId, { $inc: { subscribers: 1 } });
        res.status(200).json('Subscription successful...');
    } catch (err) {
        next(err)
    }
}

export const unsubscribe = async (req: ReqWithUser, res: Response, next: NextFunction) => {
    if (!req.user) {
        return next(createError(403, 'You are not authorized...'));
    }
    try {
        await User.findByIdAndUpdate(req.user.id, { $pull: { subscribedUsers: req.params.userId } });
        await User.findByIdAndUpdate(req.params.userId, { $inc: { subscribers: -1 } });
        res.status(200).json('Unsubscribed Successfully...');
    } catch (err) {
        next(err)
    }
}

export const like = async (req: ReqWithUser, res: Response, next: NextFunction) => {
    if (!req.user) {
        return next(createError(403, 'You are not authorized...'));
    }
    try {
        await Video.findByIdAndUpdate(req.params.videoId, {
            $addToSet: { likes: req.user.id },
            $pull: { dislikes: req.user.id }
        });
        res.status(202).json('Video liked Successfully...');
    } catch (err) {
        next(err)
    }
}

export const dislike = async (req: ReqWithUser, res: Response, next: NextFunction) => {
    if (!req.user) {
        return next(createError(403, 'You are not authorized...'));
    }
    try {
        await Video.findByIdAndUpdate(req.params.videoId, {
            $addToSet: { dislikes: req.user.id },
            $pull: { likes: req.user.id }
        });
        res.status(202).json('Video disliked Successfully...');
    } catch (err) {
        next(err)
    }
}

export const changePassword = async (req: ReqWithUser, res: Response, next: NextFunction) => {
    if (!req.user) {
        return next(createError(403, 'You are not authorized...'));
    }
    if (req.params.userId === req.user.id) {
        try {
            const body: ChangePasswordBody = changePasswordBodySchema.parse(req.body);
            const hashedPassword = await bcrypt.hash(body.password, 5);
            const hashedPasswordBody = { password: hashedPassword };
            await User.findByIdAndUpdate(
                req.params.userId,
                {
                    $set: hashedPasswordBody,
                }
            );
            res.status(200).json('Password Successfully Changed');
        } catch (err) {
            next(err);
        }
    } else {
        return next(createError(403, 'You can only update your own account...'));
    }
}