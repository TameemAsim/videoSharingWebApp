import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
    userId :{
        type: String,
        required: true
    },
    channelName: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    thumbnailURL: {
        type: String,
        required: true
    },
    thumbnailName: {
        type: String,
        required: true
    },
    videoURL: {
        type: String,
        required: true
    },
    videoName: {
        type: String,
        required: true
    },
    views: {
        type: Number,
        default: 0
    },
    tags: {
        type: [String],
        default: []
    },
    likes: {
        type: [String],
        default: []
    },
    dislikes: {
        type: [String],
        default: []
    }
}, {timestamps: true});

export default mongoose.model('Video', videoSchema);