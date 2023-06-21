const express = require("express");
const { Types } = require("mongoose");
const Label = require("../models/labelSchema");


const labelRoutes = express.Router();


labelRoutes.route('/').get(async (req, res) => {
    try {
        const result = await Label.find()

        res.json({ success: true, data: result })
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        })
    }

});

labelRoutes.route('/:id').get(async (req, res) => {
    try {
        console.log(req.params);
        const { id } = req.params

        if (Types.ObjectId.isValid(id)) {
            const result = await Label.findById({ _id: id })

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

labelRoutes.route('/add').post(async (req, res) => {
    try {
        const { name, color } = req.body

        if(!name || !color){
            res.status(400).json({success: false, message: "Name and color are required"})
        }
        const existingLabel = await Label.findOne({ $or: [{ name }, { color }] })

        if (existingLabel) {
            res.json({
                success: false,
                message: "Label already exists"
            })
        }
        else {
            const newLabel = new Label({ name, color })

            await newLabel.save()
            res.status(201).json({ success: true, data: newLabel })

            console.log(req.body);
        }

    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        })
    }

});

labelRoutes.route('/update/:id').put(async (req, res) => {
    try {
        const { id } = req.params
        const { name, color } = req.body

        if (Types.ObjectId.isValid(id)) {
            if (!name && !color) {
                res.status(400).json({ success: false, message: "Name or color is not provided" })
            }
            const existingLabel = await Label.findOne({ $or: [{ name }, { color }] })
            if (existingLabel) {
                res.json({
                    success: false,
                    message: "Label already exists"
                })
            }
            else {
                const updatedLabel = await Label.findByIdAndUpdate(id, req.body, { runValidators: true, new: true })

                if(updatedLabel){
                   res.json({ success: true, data: updatedLabel })
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

labelRoutes.route('/delete/:id').delete(async (req, res) => {
    try {
        const { id } = req.params

        if (Types.ObjectId.isValid(id)) {
            const deletedLabel = await Label.findByIdAndDelete({ _id: id })
            
            if(deletedLabel){
                res.json({ success: true, data: deletedLabel })
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

module.exports = labelRoutes;