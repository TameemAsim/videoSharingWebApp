import mongoose  from "mongoose";

const commentSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    videoId: {
        type: String,
        required: true
    },
    desc: {
        type: String,
        default: 'Empty Comment'
    }
})

export default mongoose.model('Comment', commentSchema);