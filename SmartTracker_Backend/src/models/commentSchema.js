const mongoose = require("mongoose")

const commentSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true,
    },
    is_reply: {
        type: Boolean,
        required: true,
        default: false
    },
    parent_comment_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    },
    bug_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Bug',
        required: true
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
}, { timestamps: true })

const Comment = mongoose.model('Comment', commentSchema);
module.exports = Comment;