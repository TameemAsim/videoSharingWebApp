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
import path from "path";
import { fileURLToPath } from "url";


const __filename = fileURLToPath(import.meta.url);
const dir1 = path.dirname(__filename);
const __dirname = path.dirname(dir1);

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

app.use(cors());

app.use(express.json());
app.use(cookieParser());

app.use(express.static(path.join(__dirname, '../client1/build')));

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/videos', videoRoutes);
app.use('/api/comments', commentRoutes);
app.use(express.static("public"));
app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client1/build/index.html'));
});


app.use(errorHandler);


app.listen(port, ()=>{
    console.log('Server started on port 5000.');
})