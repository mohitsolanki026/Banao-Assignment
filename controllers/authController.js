const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { error, success } = require("../utils/responseWrapper");

const signupController = async (req, res) => {
    try {
        const {  userName, email, password } = req.body;

        if (!email || !password  || !userName){
            return res.send(error(400, "All fields are required"));
        }
        const checkUserName = await User.findOne({userName});

        if(checkUserName){
            return res.send(error(409, "UserName is already taken"));
        }

        const oldUser = await User.findOne({ email });

        if (oldUser) {
            return res.send(error(409, "User is already registered"));
        }

        const user = await User.create({
            email,
            password,
            userName
        });

        return  res.send(success(201,user));
    } catch (e) {
        return res.send(error(500, e.message));
    }
};

const loginController = async (req, res) => {
    try {
        const { userName, password } = req.body;

        if (!userName || !password) {
            return res.send(error(400, "All fields are required"));
        }

        const user = await User.findOne({ userName }).select('+password');
        if (!user) {
            return res.send(error(404, "User is not registered"));
        }

        if (password !== user.password) {
            return res.send(error(403, "incorrect password"));
        }

        const accessToken = generateAccessToken({
            _id: user._id,
        });


        return res.send(success(200, { accessToken }));
    } catch (e) {
        return res.send(error(500, e.message));
    }
};

const forgotPassword = async(req,res) =>{
    try {        
        const {email ,newPassword} = req.body;
        
        if (!email) {
            return res.send(error(400, "All fields are required"));
        }
    
        const user = await User.findOne({ email });
        if (!user) {
            return res.send(error(404, "User is not registered"));
        }
    
        user.password = newPassword;
        await user.save();
    
        return res.send(success(200, "password updated success"));

    } catch (e) {
        return res.send(error(500, e.message));
    }    
}

//internal functions
const generateAccessToken = (data) => {
    try {
        const token = jwt.sign(data, process.env.ACCESS_TOKEN_PRIVATE_KEY, {
            expiresIn: "1d",
        });
        return token;
    } catch (error) {
        console.log(error);
    }
};


module.exports = {
    signupController,
    loginController,
    forgotPassword
};