const express = require("express");
const { Types } = require("mongoose");
const Board = require("../models/boardSchema");
const List = require("../models/listSchema");

const listRoutes = express.Router();


listRoutes.route('/').get(async (req, res) => {
    try {
        const result = await List.find()

        res.json({ success: true, data: result })
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        })
    }

});

listRoutes.route('/:id').get(async (req, res) => {
    try {
        console.log(req.params);
        const { id } = req.params

        if (Types.ObjectId.isValid(id)) {
            const result = await List.findById({ _id: id })

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

listRoutes.route('/add').post(async (req, res) => {
    try {
        const { name, board_id } = req.body

        // const existingList = await List.findOne({ name })

        // if (existingList) {
        //     res.json({
        //         success: false,
        //         message: "List already exists"
        //     })
        // }
        if (!Types.ObjectId.isValid(board_id) || !await Board.findById({ _id: board_id })) {
            res.status(400).json({ success: false, message: "Invalid board id" })
        }
        else {

            const newList = new List({ name, board_id })

            await newList.save()
            res.status(201).json({ success: true, data: newList })

            console.log(req.body);
        }

    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        })
    }

});

listRoutes.route('/update/:id').put(async (req, res) => {
    try {
        const { id } = req.params
        const { name, board_id, sequence } = req.body

        if (Types.ObjectId.isValid(id)) {
            if (!name && !board_id && !sequence) {
                res.status(400).json({ success: false, message: "Name or workspace or sequence must be provided" })
            }
            if (board_id) {
                if (!Types.ObjectId.isValid(board_id) || !await Board.findById({ _id: board_id })) {
                    res.status(400).json({ success: false, message: "Invalid board id" })
                }
            }

            const updatedList = await List.findByIdAndUpdate(id, req.body, { runValidators: true, new: true })

            if (updatedList) {
                res.json({ success: true, data: updatedList })
            }
            else {
                res.status(404).json({ success: false, message: "Record not found" })
            }

            console.log(req.body);

        }
        else {
            res.status(400).json({ success: false, message: "Invalid id" })
        }
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        })
    }

});

listRoutes.route('/delete/:id').delete(async (req, res) => {
    try {
        const { id } = req.params

        if (Types.ObjectId.isValid(id)) {
            const deletedList = await List.findByIdAndDelete({ _id: id })

            if (deletedList) {
                res.json({ success: true, data: deletedList })
            }
            else {
                res.status(404).json({ success: false, data: "Record not found" })
            }
        }
        else {
            res.status(400).json({ success: false, message: "Invalid id" })
        }
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        })
    }

});

listRoutes.route('/getListsWithBugs/:boardId').get(async (req, res) => {
    try {
        const { boardId } = req.params
        console.log('boardId ', boardId);

        if (Types.ObjectId.isValid(boardId)) {
            // Find all lists that belong to the specified board
            const lists = await List.aggregate([
                {
                    $match: {
                        board_id: new Types.ObjectId(boardId)
                    }
                },
                {
                    $lookup: {
                        from: 'bugs',
                        localField: '_id',
                        foreignField: 'list_id',
                        as: 'bugs'
                    }
                }
            ]).exec();

            res.json({ success: true, lists })
        }
        else {
            res.status(400).json({ success: false, message: "Invalid id" })
        }
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        })
    }

});


module.exports = listRoutes;