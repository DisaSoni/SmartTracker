const express = require("express");
const { Types } = require("mongoose");
const Workspace = require("../models/workspaceSchema");


const workspaceRoutes = express.Router();


workspaceRoutes.route('/').get(async (req, res) => {
    try {
        const result = await Workspace.find()

        res.json({ success: true, data: result })
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        })
    }

});

workspaceRoutes.route('/:id').get(async (req, res) => {
    try {
        console.log(req.params);
        const { id } = req.params

        if (Types.ObjectId.isValid(id)) {
            const result = await Workspace.findById({ _id: id })

            if (result) {
                res.json({ success: true, data: result })
            }
            else {
                res.status(404).json({ success: false, message: "Record not found" })
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

workspaceRoutes.route('/add').post(async (req, res) => {
    try {
        const { name } = req.body

        const existingWorkspace = await Workspace.findOne({ name })

        if (existingWorkspace) {
            res.json({
                success: false,
                message: "Workspace already exists"
            })
        }
        else {
            const newWorkspace = new Workspace({
                name
            })

            await newWorkspace.save()
            res.status(201).json({ success: true, data: newWorkspace })

            console.log(req.body);
        }

    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        })
    }

});

workspaceRoutes.route('/update/:id').put(async (req, res) => {
    try {
        const { id } = req.params
        const { name } = req.body

        if (Types.ObjectId.isValid(id)) {
            if (!name) {
                res.status(400).json({ success: false, message: "Name is not provided" })
            }
            else {
                const updatedWorkspace = await Workspace.findByIdAndUpdate(id, req.body, { runValidators: true, new: true })

                if(updatedWorkspace){
                   res.json({ success: true, data: updatedWorkspace })
                }
                else{
                    res.status(404).json({ success: false, message: "Record not found"})
                }

                console.log(req.body);
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

workspaceRoutes.route('/delete/:id').delete(async (req, res) => {
    try {
        const { id } = req.params

        if (Types.ObjectId.isValid(id)) {
            const deletedWorkspace = await Workspace.findByIdAndDelete({ _id: id })
            
            if(deletedWorkspace){
                res.json({ success: true, data: deletedWorkspace })
            }
            else{
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

module.exports = workspaceRoutes;