const userDataMiddleware = require("../middlewares/user_middleware")
const userPersonalityModel = require('../models/userPersonalityAns.model')
const userModel = require('../models/users.model');


const addUserData = (req, res, next) => {
    userDataMiddleware.AddUserProfile(req.body)
        .then((result) => {
            res.status(201).json({
                status: true,
                message: "Successfully Added User Profile",
                data: result.createProfile,
            });
        })
        .catch((err) => {
            res.status(500).json({
                status: false,
                message: err.message,
            });
        });
};

const getAllUserProfiles = async (req, res, next) => {
    let condObj = {};
    let projectObj = {};
    let sortObj = {};
    // "userType","name","email","username"
    let { status, userType, name, email, username } = req.query;

    if (userType) condObj.userType = userType;
    if (name) condObj.name = name;
    if (username) condObj.username = username;

    const pointsByCategory = {};
    let sortedData
    if (email) {
        condObj.email = email;
        let fetchID = await userModel.findOne({ email: req.query.email, status: "active" })
        if(!fetchID){
            return res.json({
                status:false,
                message:"user not found"
            })
        }
        let findUserAnswers = await userPersonalityModel.find({ userId: fetchID._id, status: "active" })

        findUserAnswers.forEach(question => {
            const { relatedTo, points } = question;
            pointsByCategory[relatedTo] = (pointsByCategory[relatedTo] || 0) + points;
        });

        const dataArray = Object.entries(pointsByCategory);

        // Sort the array in descending order based on values
        dataArray.sort((a, b) => b[1] - a[1]);

        // Convert the sorted array back to an object
        sortedData = Object.fromEntries(dataArray);

    }

    if (status) {
        if (status.toLowerCase() != 'all')
            condObj.status = status;
    } else {
        condObj.status = 'active';
    }
    let queryObj = {
        condObj,
        projectObj,
        sortObj
    }
    userDataMiddleware.GetAllUserProfiles(queryObj).then((result) => {
        if (result?.data?.[0]?.personality) {
            res.json({
                status: true,
                total_profiles: result.data.length,
                data: result.data,
                personalitiesData: sortedData
            });
        } else {
            res.json({
                status: true,
                total_profiles: result.data.length,
                data: result.data,
            });
        }
    }).catch((err) => {
        res.json({
            status: false,
            message: err.message,
        });
    });
}

const updateUserProfile = (req, res, next) => {
    let bodyObj = {};
    bodyObj.query = req.query;
    bodyObj.body = req.body;
    bodyObj.params = req.params;
    userDataMiddleware.UpdateUserProfile(bodyObj)
        .then((result) => {
            res.status(200).json({
                status: true,
                message: "Updated User profile data successfully",
                data: result.data,
            });
        })
        .catch((err) => {
            res.status(500).json({
                status: false,
                message: err.message,
            });
        });
};


//changeUsetype
const changeUserType = (req, res, next) => {
    let bodyObj = {};
    bodyObj.query = req.query;
    bodyObj.body = req.body;
    bodyObj.params = req.params;
    userDataMiddleware.ChangeUserType(bodyObj)
        .then((result) => {
            res.status(200).json({
                status: true,
                message: "Updated userType to mentor profile data successfully",
                data: result.data,
            });
        })
        .catch((err) => {
            res.status(500).json({
                status: false,
                message: err.message,
            });
        });
};



module.exports = {
    addUserData,
    getAllUserProfiles,
    updateUserProfile,
    changeUserType
}
