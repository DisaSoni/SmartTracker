const express = require("express");
const { Types } = require("mongoose");
const User = require("../models/userSchema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userRoutes = express.Router();

userRoutes.route('/login').post(async (req, res) => {
    try {
        const { email, password } = req.body

        const user = await User.findOne({ email: email })

        if (user) {
            //comparing passwords
            const passwordIsValid = await bcrypt.compare(password, user.password);

            // checking if password was valid and send response accordingly
            if (!passwordIsValid) {
                return res.status(401)
                    .send({
                        success: false,
                        message: "Invalid Password!"
                    });
            }

            // const token = jwt.sign(
            //     { id: user.id },
            //     process.env.API_SECRET || 'ahfah819u12ne',
            //     { expiresIn: 86400 });

            return res.status(200).send({ success: true, user });
        }
        else {
            return res.status(404).send({ success: false, message: "User Not found." });
        }
    } catch (error) {
        console.error(error);

        res.status(400).json({
            success: false,
            message: error.message
        })
    }
})

userRoutes.route('/').get(async (req, res) => {
    try {
        const result = await User.find()

        res.json({ success: true, data: result })
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        })
    }

});

userRoutes.route('/:id').get(async (req, res) => {
    try {
        console.log(req.params);
        const { id } = req.params

        if (Types.ObjectId.isValid(id)) {
            const result = await User.findById({ _id: id })

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

userRoutes.route('/add').post(async (req, res) => {
    try {
        const { name, email, password, type } = req.body

        const existingUser = await User.findOne({ email })

        if (!name || !email || !password || !type) {
            res.status(400).json({ success: false, message: "Name, email, password and type are required" })
        }
        else if (existingUser) {
            res.json({
                success: false,
                message: "User already exists"
            })
        }
        else {
            const newUser = new User({ name, email, password: bcrypt.hashSync(password, 8), type })

            await newUser.save()
            res.status(201).json({ success: true, data: newUser })

            console.log(req.body);
        }

    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        })
    }

});

userRoutes.route('/update/:id').put(async (req, res) => {
    try {
        const { id } = req.params
        const { name, email, password, type, workspaces } = req.body

        if (Types.ObjectId.isValid(id)) {
            if (!name && !email && !password && !type && !workspaces) {
                res.status(400).json({ success: false, message: "Name, email, password, type, workspaces is not provided" })
            }
            else {
                const updatedUser = await User.findByIdAndUpdate(id, req.body, { runValidators: true, new: true })

                if (updatedUser) {
                    res.json({ success: true, data: updatedUser })
                }
                else {
                    res.status(404).json({ success: false, message: "Record not found" })
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

userRoutes.route('/delete/:id').delete(async (req, res) => {
    try {
        const { id } = req.params

        if (Types.ObjectId.isValid(id)) {
            const deletedUser = await User.findByIdAndDelete({ _id: id })

            if (deletedUser) {
                res.json({ success: true, data: deletedUser })
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

module.exports = userRoutes;