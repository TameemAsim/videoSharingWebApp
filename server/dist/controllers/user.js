var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import User from "../models/user.js";
import Video from '../models/video.js';
import { createError } from "../restFunctions/error.js";
import bcrypt from 'bcrypt';
import { z } from "zod";
const updateUserBodySchema = z.object({
    username: z.string().min(1).optional(),
    email: z.string().min(1).email().optional(),
    img: z.string().min(1).optional(),
    imgName: z.string().min(1).optional(),
    subscribers: z.string().min(1).optional(),
    subscribedUsers: z.array(z.string()).optional()
});
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
});
export const update = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user) {
        return next(createError(403, 'You are not authorized...'));
    }
    if (req.params.userId === req.user.id) {
        try {
            const body = updateUserBodySchema.parse(req.body);
            const user = yield User.findByIdAndUpdate(req.params.userId, {
                $set: body,
            }, { new: true });
            if (!user) {
                return next(createError(401, 'User Not Found...'));
            }
            res.status(200).json({
                _id: user._id,
                username: user.username,
                email: user.email,
                subscribers: user.subscribers,
                subscribedUsers: user.subscribedUsers,
                img: user.img,
                imgName: user.imgName
            });
        }
        catch (err) {
            next(err);
        }
    }
    else {
        return next(createError(403, 'You can only update your own account...'));
    }
});
export const deletion = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user) {
        return next(createError(403, 'You are not authorized...'));
    }
    if (req.params.userId === req.user.id) {
        try {
            yield User.findByIdAndDelete(req.params.userId);
            res.status(200).json('User has been deleted');
        }
        catch (err) {
            next(err);
        }
    }
    else {
        return next(createError(403, 'You can only delete your own account...'));
    }
});
export const getUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield User.findById(req.params.userId);
        if (!user)
            return next(createError(401, 'This user do not exist'));
        res.status(200).json({
            _id: user._id,
            username: user.username,
            email: user.email,
            subscribers: user.subscribers,
            subscribedUsers: user.subscribedUsers,
            img: user.img,
            imgName: user.imgName
        });
    }
    catch (err) {
        next(err);
    }
});
export const subscribe = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user) {
        return next(createError(403, 'You are not authorized...'));
    }
    try {
        yield User.findByIdAndUpdate(req.user.id, { $push: { subscribedUsers: req.params.userId } });
        yield User.findByIdAndUpdate(req.params.userId, { $inc: { subscribers: 1 } });
        res.status(200).json('Subscription successful...');
    }
    catch (err) {
        next(err);
    }
});
export const unsubscribe = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user) {
        return next(createError(403, 'You are not authorized...'));
    }
    try {
        yield User.findByIdAndUpdate(req.user.id, { $pull: { subscribedUsers: req.params.userId } });
        yield User.findByIdAndUpdate(req.params.userId, { $inc: { subscribers: -1 } });
        res.status(200).json('Unsubscribed Successfully...');
    }
    catch (err) {
        next(err);
    }
});
export const like = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user) {
        return next(createError(403, 'You are not authorized...'));
    }
    try {
        yield Video.findByIdAndUpdate(req.params.videoId, {
            $addToSet: { likes: req.user.id },
            $pull: { dislikes: req.user.id }
        });
        res.status(202).json('Video liked Successfully...');
    }
    catch (err) {
        next(err);
    }
});
export const dislike = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user) {
        return next(createError(403, 'You are not authorized...'));
    }
    try {
        yield Video.findByIdAndUpdate(req.params.videoId, {
            $addToSet: { dislikes: req.user.id },
            $pull: { likes: req.user.id }
        });
        res.status(202).json('Video disliked Successfully...');
    }
    catch (err) {
        next(err);
    }
});
export const changePassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user) {
        return next(createError(403, 'You are not authorized...'));
    }
    if (req.params.userId === req.user.id) {
        try {
            const body = changePasswordBodySchema.parse(req.body);
            const hashedPassword = yield bcrypt.hash(body.password, 5);
            const hashedPasswordBody = { password: hashedPassword };
            yield User.findByIdAndUpdate(req.params.userId, {
                $set: hashedPasswordBody,
            });
            res.status(200).json('Password Successfully Changed');
        }
        catch (err) {
            next(err);
        }
    }
    else {
        return next(createError(403, 'You can only update your own account...'));
    }
});
