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
import bcrypt from 'bcrypt';
import { createError } from '../restFunctions/error.js';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
const signInSchema = z.object({
    username: z.string(),
    password: z.string().min(6).max(15).refine((value) => {
        // Regular expressions to check for different character types
        const hasUppercase = /[A-Z]/.test(value);
        const hasLowercase = /[a-z]/.test(value);
        const hasNumber = /[0-9]/.test(value);
        const hasSpecialChar = /[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/.test(value);
        // Ensure all required conditions are met
        return hasUppercase && hasLowercase && hasNumber && hasSpecialChar;
    }, 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
});
const signUpSchema = z.object({
    username: z.string(),
    password: z.string().min(6).max(15).refine((value) => {
        // Regular expressions to check for different character types
        const hasUppercase = /[A-Z]/.test(value);
        const hasLowercase = /[a-z]/.test(value);
        const hasNumber = /[0-9]/.test(value);
        const hasSpecialChar = /[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/.test(value);
        // Ensure all required conditions are met
        return hasUppercase && hasLowercase && hasNumber && hasSpecialChar;
    }, 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
    email: z.string().email(),
});
export const signin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = signInSchema.parse(req.body);
        // Rest of your code
        const user = yield User.findOne({ username: body.username });
        if (!user) {
            return next(createError(404, 'User not found...'));
        }
        const isCorrect = bcrypt.compare(req.body.password, user.password);
        if (!isCorrect)
            return next(createError(400, 'Wrong Password'));
        const JWTKEY = process.env.JWTKEY;
        if (!JWTKEY) {
            return next(createError(500, 'An error occured'));
        }
        const token = jwt.sign({ id: user._id }, JWTKEY);
        res.cookie('access_token', token).status(201).json({
            _id: user._id,
            username: user.username,
            email: user.email,
            subscribers: user.subscribers,
            subscribedUsers: user.subscribedUsers,
            img: user.img,
            imgName: user.imgName
        });
    }
    catch (error) {
        if (error instanceof z.ZodError) {
            res.json(error.issues[0].message);
            return;
        }
        next(error);
    }
});
export const signup = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = signUpSchema.parse(req.body);
        const hashedPassword = yield bcrypt.hash(req.body.password, 5);
        const newUser = new User({
            username: body.username,
            email: body.email,
            password: hashedPassword,
        });
        yield newUser.save();
        res.status(200).send('User Created Successfully...');
    }
    catch (error) {
        if (error instanceof z.ZodError) {
            res.json(error.issues[0].message);
            return;
        }
        next(error);
    }
});
