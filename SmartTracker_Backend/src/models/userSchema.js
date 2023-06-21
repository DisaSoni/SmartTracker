const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        default: false,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email address']
    },
    password: {
        type: String,
        required: true
    },
    type: { 
        type: String,
        enum: ['member', 'viewer', 'admin'],
        required: true
    },
})

const User = mongoose.model('User', userSchema);
module.exports = User;