const mongoose = require("mongoose")

const labelSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Label name is required'],
        unique: true
    },
    color: {
        type: String,
        required: [true, 'Color is required'],
        unique: true
    }
})

const Label = mongoose.model('Label', labelSchema);
module.exports = Label;