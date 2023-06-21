const mongoose = require("mongoose")

const boardSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    is_starred: {
        type: Boolean,
        required: true,
        default: false
    },
    workspace_id: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Workspace',
        required: true
    },
    users: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User'
    }]
})

const Board = mongoose.model('Board', boardSchema);
module.exports = Board;