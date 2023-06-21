const jwt = require("jsonwebtoken");
const User = require("../models/userSchema");

const verifyAuth = async (req, res, next) => {
    try {
        if (req.headers
            && req.headers.authorization
            && req.headers.authorization.split(' ')[0] === 'JWT') {
            jwt.verify(req.headers.authorization.split(' ')[1],
                process.env.API_SECRET || 'ahfah819u12ne', async (error, user) => {
                    if (error) req.user = undefined;
                    
                    const userFound = await User.findOne({ _id: user?.id })
                    
                    if(userFound){
                        req.user = user;
                        next();
                    }
                    else{
                        return res.status(400).json({
                            success: false,
                            message: "User authorization failed"
                        })
                    }
                });
        } else {
            return res.status(400).json({
                success: false,
                message: "User authorization failed"
            })
        }
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        })
    }

};

module.exports = verifyAuth;