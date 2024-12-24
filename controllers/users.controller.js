const { findOneAndUpdate } = require('../models/path.model');
const userModel = require('../models/users.model');
const axios = require('axios');
const userPersonalityModel = require('../models/userPersonalityAns.model')

const addUser = async (req, res) => {
    let checkuser = await userModel.findOne({ email: req.body.email, status: "active" });
    
    if (!checkuser) {
        return res.json({
            status: false,
            message: 'Error in update Profile',
        })
    }
    checkuser.email= req.body.email;
    checkuser.name= req.body.name;
    checkuser.country= req.body.country;
    checkuser.state= req.body.state;
    checkuser.city= req.body.city;
    checkuser.postalCode= req.body.postalCode;
    checkuser.profilePicture= req.body.profilePicture
    checkuser.status= "active";
    checkuser.user_level=1;
    
    checkuser.save();

    if (!user) {
        return res.json({
            status: false,
            message: 'Error in creating user',
        })
    }
    return res.json({
        status: true,
        message: 'User created Successfully',
        data: user
    })
}

const getUsers = async (req, res) => {
    let filter = {}
    if (req.query.status) {
        filter.status = req.query.status;
        if (req.query.status == "all")
            filter = {};
    } else {
        filter.status = "active"
    }
    if (req.query.userType) filter.userType = req.query.userType;
    if (req.query.name) filter.name = req.query.name;
    if (req.query.email) filter.email = req.query.email;
    if (req.query.username) filter.username = req.query.username;

    let users = await userModel.find(filter);
    if (!users) {
        return res.json({
            status: false,
            message: 'Error in fetching users',
        })
    }
    return res.json({
        status: true,
        message: 'Users fetched',
        data: users
    })
}

let addMentor = async (req, res) => {
    let userData = await userModel.findOneAndUpdate({ email: req.body.email, status: "active" }, { userType: "mentor" }, { new: true });
    if (!userData) {
        return res.json({
            status: false,
            message: 'Error in updating user',
        })
    }
    if (!userData.userType) {
        return res.json({
            status: false,
            message: 'User is not registered',
        })
    }
    return res.json({
        status: true,
        message: 'User updated as mentor',
        data: userData
    })
}

//Update user level3 status
let updateUser = async (req, res) => {
    let userData = await userModel.findOne({ _id: req.body.userId, status: "active" });
    if (!userData) {
        return res.json({
            status: false,
            message: "user not found"
        })
    }
    // console.log(userData.user_level)
    if (userData?.user_level >= 2) {
        let findUserAnswers = await userPersonalityModel.find({ userId: req.body.userId, status: "active" })
        if (!findUserAnswers) {
            return res.json({
                status: false,
                message: "user not updated to level 2",
            })
        }

        if (findUserAnswers.length !== 48) {
            return res.json({
                status: false,
                message: "All 48 questions needs to be answered",
            })
        }

        const pointsByCategory = {};

        findUserAnswers.forEach(question => {
            const { relatedTo, points } = question;
            pointsByCategory[relatedTo] = (pointsByCategory[relatedTo] || 0) + points;
        });

        // Convert the accumulated points to an array of objects
        const result = Object.entries(pointsByCategory).map(([relatedTo, points]) => ({
            relatedTo,
            points,
        }));


        const maxPointsObject = result.reduce((maxObject, currentObject) =>
            currentObject.points > maxObject.points ? currentObject : maxObject
        );


        let updateUserData = await userModel.findOneAndUpdate({ _id: req.body.userId, status: "active" }, { personality: maxPointsObject.relatedTo, user_level: 3 }, { new: true })
        if (updateUserData) {
            return res.json({
                status: true,
                message: "user updated",
                data: updateUserData
            })
        }
    } else {
        return res.json({
            status: false,
            message: "user level 2 data not updated"
        })
    }
}


module.exports = {
    addUser,
    getUsers,
    addMentor,
    updateUser
}