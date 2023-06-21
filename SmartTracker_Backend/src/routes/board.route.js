const express = require("express");
const { Types } = require("mongoose");
const Board = require("../models/boardSchema");
const Workspace = require("../models/workspaceSchema");

const boardRoutes = express.Router();


boardRoutes.route('/').get(async (req, res) => {
    try {
        const { workspace_id } = req.query;

        let result;
        if (workspace_id && Types.ObjectId.isValid(workspace_id)) {
            result = await Board.find({ workspace_id }).populate('users')
        }
        else {
            result = await Board.find()
        }

        res.json({ success: true, data: result })
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        })
    }

});

boardRoutes.route('/:id').get(async (req, res) => {
    try {
        console.log(req.params);
        const { id } = req.params

        if (Types.ObjectId.isValid(id)) {
            const result = await Board.findById({ _id: id })

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

boardRoutes.route('/add').post(async (req, res) => {
    try {
        const { name, workspace_id } = req.body


        const existingBoard = await Board.findOne({ name })

        if (existingBoard) {
            res.json({
                success: false,
                message: "Board already exists"
            })
        }
        else if (!Types.ObjectId.isValid(workspace_id) || !await Workspace.findById({ _id: workspace_id })) {
            res.status(400).json({ success: false, message: "Invalid workspace id" })
        }
        else {
            const newBoard = new Board({ name, workspace_id })

            await newBoard.save()
            res.status(201).json({ success: true, data: newBoard })

            console.log(req.body);
        }

    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        })
    }

});

boardRoutes.route('/update/:id').put(async (req, res) => {
    try {
        const { id } = req.params
        const { name, workspace_id } = req.body

        if (Types.ObjectId.isValid(id)) {
            if (!name && !workspace_id) {
                return res.status(400).json({ success: false, message: "Name or workspace must be provided" })
            }
            if (workspace_id) {
                if (!Types.ObjectId.isValid(workspace_id) || !await Workspace.findById({ _id: workspace_id })) {
                    return res.status(400).json({ success: false, message: "Invalid workspace id" })
                }
            }

            const updatedBoard = await Board.findByIdAndUpdate(id, req.body, { runValidators: true, new: true }).populate('users')

            if (updatedBoard) {
                return res.json({ success: true, data: updatedBoard })
            }
            else {
                return res.status(404).json({ success: false, message: "Record not found" })
            }
        }
        else {
            return res.status(400).json({ success: false, message: "Invalid id" })
        }
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        })
    }

});

boardRoutes.route('/delete/:id').delete(async (req, res) => {
    try {
        const { id } = req.params

        if (Types.ObjectId.isValid(id)) {
            const deletedBoard = await Board.findByIdAndDelete({ _id: id })

            if (deletedBoard) {
                res.json({ success: true, data: deletedBoard })
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

module.exports = boardRoutes;