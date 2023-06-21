const express = require("express");
const { Types } = require("mongoose");
const Board = require("../models/boardSchema");
const Bug = require("../models/bugSchema");
const List = require("../models/listSchema");
const User = require("../models/userSchema");

const bugRoutes = express.Router();


bugRoutes.route('/').get(async (req, res) => {
    try {
        const result = await Bug.find()

        res.json({ success: true, data: result })
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        })
    }

});

bugRoutes.route('/:id').get(async (req, res) => {
    try {
        console.log(req.params);
        const { id } = req.params

        if (Types.ObjectId.isValid(id)) {
            const result = await Bug.findById({ _id: id })

            if (result) {
                res.json({ success: true, data: result })
            }
            else {
                res.status(404).json({ success: false, message: "Record not found" })
            }
        }
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        })
    }
});

bugRoutes.route('/add').post(async (req, res) => {
    try {
        const { title, description, attachment, priority, sequence, list_id, user_id } = req.body

        if (!title && !list_id && !user_id) {
            res.status(400).json({ success: false, message: "Title, list_id and user_id is required" })
        }
        else if (!Types.ObjectId.isValid(user_id) || !await User.findById({ _id: user_id })) {
            res.status(400).json({ success: false, message: "Invalid user id" })
        }
        else if (!Types.ObjectId.isValid(list_id) || !await List.findById({ _id: list_id })) {
            res.status(400).json({ success: false, message: "Invalid list id" })
        }
        else {
            const newBug = new Bug({ title, description, attachment, priority, sequence, list_id, user_id })

            await newBug.save()
            res.status(201).json({ success: true, data: newBug })

            console.log(req.body);
        }

    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        })
    }

});

bugRoutes.route('/update/:id').put(async (req, res) => {
    try {
        const { id } = req.params
        const { title, description, attachment, priority, sequence, list_id, user_id } = req.body

        if (Types.ObjectId.isValid(id)) {
            console.log('user_id ', user_id)
            if (!title && !description && !attachment && !priority && !sequence && !user_id && !list_id) {
                return res.status(400).json({ success: false, message: "Nothing provided for update" })
            }
            else if (user_id && (!Types.ObjectId.isValid(user_id) || !await User.findById({ _id: user_id }))) {
                return res.status(400).json({ success: false, message: "Invalid user id" })
            }
            else if (list_id && (!Types.ObjectId.isValid(list_id) || !await List.findById({ _id: list_id }))) {
                return res.status(400).json({ success: false, message: "Invalid list id" })
            }
            else {
                const updatedBug = await Bug.findByIdAndUpdate(id, req.body, { runValidators: true, new: true })

                if (updatedBug) {
                    return res.json({ success: true, data: updatedBug })
                }
                else {
                    return res.status(404).json({ success: false, message: "Record not found" })
                }
            }
        }
        else {
            return res.status(400).json({ success: false, message: "Invalid id" })
        }
    } catch (error) {
        console.error('error ', error);
        return res.status(400).json({
            success: false,
            message: error.message
        })
    }

});


bugRoutes.route('/updateBatch').put(async (req, res) => {
    try {
        const { bugs } = req.body;
        console.log(' req.body ',  req.body);
        if (!bugs || !Array.isArray(bugs)) {
            return res.status(400).json({ success: false, message: 'Invalid payload' });
        }

        const bulkOperations = bugs.map(({ id, sequence, list_id }) => ({
            updateOne: {
                filter: { _id: id },
                update: { sequence, list_id }
            }
        }));

        await Bug.bulkWrite(bulkOperations);

        return res.json({ success: true });
    } catch (error) {
        console.error('updateBatch ', error);
        return res.status(400).json({ success: false, message: error.message });
    }
});

bugRoutes.route('/delete/:id').delete(async (req, res) => {
    try {
        const { id } = req.params

        if (Types.ObjectId.isValid(id)) {
            const deletedBug = await Bug.findByIdAndDelete({ _id: id })

            if (deletedBug) {
                res.json({ success: true, data: deletedBug })
            }
            else {
                res.status(404).json({ success: false, message: "Record not found" })
            }
        }
        else {
            res.status(400).json({ message: "Invalid id" })
        }
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        })
    }

});

module.exports = bugRoutes;