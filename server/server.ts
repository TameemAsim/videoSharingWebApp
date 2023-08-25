import express from "express";
import mongoose from "mongoose";
import dotenv from 'dotenv';
import userRoutes from './routes/users.js';
import commentRoutes from "./routes/comments.js";
import videoRoutes from "./routes/videos.js";
import authRoutes from "./routes/auths.js";
import cookieParser from "cookie-parser";
import errorHandler from "./middlewares/errorHandler.js";
import cors from 'cors';
import { error } from "console";


const app = express();
dotenv.config();
const port = 5000;
const connect = ()=>{
    if(!process.env.DBURL) {
        return console.log('DBURL not found...');
    }
    mongoose.connect(process.env.DBURL).then(()=>{
        console.log('DB Connected');
    }).catch(err => {
        console.log('Error occured in db connection: ' + err.message);
    });
}
connect();

app.use(cors({
    origin: true,
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.get('/', (req, res) => {
    res.send('Welcome!');
})
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/videos', videoRoutes);
app.use('/api/comments', commentRoutes);

// Error Handler
app.use(errorHandler);


app.listen(port, ()=>{
    console.log('Server started on port 5000.');
})