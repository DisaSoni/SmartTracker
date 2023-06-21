const mongoose = require("mongoose")

const bugSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    attachment: {
        data: Buffer,
        contentType: String
    },
    priority: {
        type: String,
        enum: ["normal", "moderate", "urgent"],
        default: "normal",
        required: true,
    },
    sequence: {
        type: Number,
        required: true,
        default: 1
    },
    list_id: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'List',
        required: true
    },
    user_id: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
        required: true
    }
})

const Bug = mongoose.model('Bug', bugSchema);
module.exports = Bug;