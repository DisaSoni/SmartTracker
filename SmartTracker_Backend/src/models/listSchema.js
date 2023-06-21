const mongoose = require("mongoose")

const listSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    sequence: {
        type: Number,
        required: true,
        default: 1
    },
    board_id: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Board',
        required: true
    }
})

const List = mongoose.model('List', listSchema);
module.exports = List;