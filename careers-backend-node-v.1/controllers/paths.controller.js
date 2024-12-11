const pathModel = require('../models/path.model');
const stepModel = require('../models/steps.model');
const userModel = require('../models/users.model');
const axios = require('axios');
const mongoose = require('mongoose')

const addPath = async (req, res) => {
    try {
        // Check if a path with the same name already exists and is active
        let existingPath = await pathModel.findOne({ nameOfPath: req.body.nameOfPath, status: "active" });

        if (existingPath) {
            return res.status(400).json({
                status: false,
                message: 'Path already exists',
            });
        }

        // Create a new path object
        let createPath = {
            email: req.body.email,
            nameOfPath: req.body.nameOfPath,
            description: req.body.description,
            current_coordinates: req.body.current_coordinates,
            feature_coordinates: req.body.feature_coordinates,
            path_type: req.body.path_type,
            path_cat: req.body.path_cat,
            university: req.body.university,
            the_ids: req.body.the_ids,
            financialSituation: req.body.financialSituation,
            destination_degree: req.body.destination_degree,
            grade_avg: req.body.grade_avg,
            curriculum: req.body.curriculum,
            grade: req.body.grade,
            stream: req.body.stream,
            program: req.body.program,
            personality: req.body.personality
        };

        // Create a new path using the pathModel
        let path = await pathModel.create(createPath);

        if (!path) {
            return res.status(500).json({
                status: false,
                message: 'Error in creating path',
            });
        }

        // Successful response with the created path data
        return res.status(200).json({
            status: true,
            message: 'Path created',
            data: path
        });
    } catch (error) {
        // Check if the error is a Mongoose validation error
        if (error.name === 'ValidationError') {
            // Handle Mongoose validation errors
            const validationErrors = {};
            for (const key in error.errors) {
                if (error.errors.hasOwnProperty(key)) {
                    validationErrors[key] = error.errors[key].message;
                }
            }
            return res.status(400).json({
                status: false,
                message: 'Validation error',
                errors: validationErrors,
            });
        }

        // Handle other errors
        console.error(error);
        return res.status(500).json({
            status: false,
            message: 'Internal server error',
        });
    }
};


const getPath = async (req, res) => {
    let filter = {}
    if (req.query.status) {
        filter.status = req.query.status;
        if (req.query.status == "all")
            filter = {};
    } else {
        filter.status = "active";
    }
    if (req.query.path_id) filter._id = new mongoose.Types.ObjectId(req.query.path_id)
    if (req.query.email) filter.email = req.query.email;
    if (req.query.nameOfPath) filter.nameOfPath = req.query.nameOfPath;
    //if (req.query.university) filter.UniversityDetails =  { $elemMatch : { "_id": req.query.university}};
    if (req.query.program) filter.program = req.query.program;
    
    console.log(filter)
    pathModel.aggregate([
        {
            $match: filter
        },
        {
            $sort: { "createdAt": -1 }
        },
        {
            $lookup: {
                from: "career_steps",
                let: { "the_ids": "$the_ids.step_id" },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    { $in: ["$_id", "$$the_ids"] },
                                    { $eq: ["$status", "active"] },
                                ],
                            }
                        }
                    },
                    // {
                    //     $group: {
                    //         "_id": "$_id",
                    //         StepDetails: {
                    //             $push: "$$ROOT"
                    //         }
                    //     }
                    // }
                ],
                as: "StepDetails"
            }
        },
        {
            $lookup: {
                from: "universities",
                let: { "u_ids": "$university" },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    { $in: ["$_id", "$$u_ids"] },
                                ],
                            }
                        }
                    },
                ],
                as: "UniversityDetails"
            }
        },
    ])
        .then(paths => {
            if (paths.length === 0) {
                return res.json({
                    status: false,
                    message: 'No data found',
                })
            }
            return res.json({
                status: true,
                total: paths.length,
                message: 'Paths data found',
                data: paths
            })
        }).catch(err => {
            console.log('err=========>', err);
            res.json({
                status: false,
                message: err.message
            });
        });
}
const getPathSpecific = async (req, res) => {
    try {
        let filter = {};

        // Set default status if not provided
        filter.status = req.query.status === 'all' ? {} : req.query.status || 'active';

        // Add _id filter if path_id is provided
        if (req.query.path_id) filter._id = new mongoose.Types.ObjectId(req.query.path_id);

        // Get user details from user service based on email
        const users = await userModel.find({ email: req.query.email }).lean();
        const user = users[0];

        // Check and add filters based on query parameters
        ['curriculum', 'grade', 'stream', 'performance', 'financialSituation','personality'].forEach(param => {
            if (req.query[param] && req.query[param] === 'true') {
                // Check if the user[param] is an array before using $in
                if (Array.isArray(user[param])) {
                    filter[param] = { $in: user[param] };
                } else {
                    filter[param] = user[param];
                }
            }
        });

        // console.log("SDSd", filter);

        // Find paths with specified filter and projection
        const paths = await pathModel.find(filter).lean();

        if (paths.length === 0) {
            return res.status(404).json({
                status: false,
                message: 'No data found',
            });
        }

        return res.status(200).json({
            status: true,
            total: paths.length,
            message: 'Paths data found',
            data: paths,
        });
    } catch (err) {
        console.log('err=========>', err);
        res.status(500).json({
            status: false,
            message: err.message,
        });
    }
};

const getPathNormal = async (req, res) => {
    try {
        const { status, financialSituation, performance, curriculum, grade, stream, personality } = req.body;

        let filter = {};

        // Set default status if not provided
        filter.status = status === 'all' ? {} : status || 'active';

        // Add _id filter if financialSituation is provided
        if (financialSituation) {
            filter.financialSituation = { $in: financialSituation };
        }
        // Add performance filter if provided
        if (performance) {
            filter.performance = { $in: performance };
        }
        // Add curriculum filter if provided
        if (curriculum) {
            filter.curriculum = { $in: curriculum };
        }
        // Add grade filter if provided
        if (grade) {
            filter.grade = { $in: grade };
        }
        // Add stream filter if provided
        if (stream) {
            filter.stream = { $in: stream };
        }
        // Add personality filter if provided
        if (personality) {
            filter.personality = { $in: personality };
        }


        const paths = await pathModel.find(filter).lean();

        if (paths.length === 0) {
            return res.status(404).json({
                status: false,
                message: 'No data found',
            });
        }

        return res.status(200).json({
            status: true,
            total: paths.length,
            message: 'Paths data found',
            data: paths,
        });
    } catch (err) {
        console.log('err=========>', err);
        res.status(500).json({
            status: false,
            message: err.message,
        });
    }
};


const updatePath = async (req, res) => {
    let updateData = {}
    if (req.body.nameOfPath) updateData.nameOfPath = req.body.nameOfPath;
    if (req.body.description) updateData.description = req.body.description;
    if (req.body.path_type) updateData.path_type = req.body.path_type;
    if (req.body.path_cat) updateData.path_cat = req.body.path_cat;
    if (req.body.the_ids) updateData.the_ids = req.body.the_ids;
    if (req.body.financialSituation) updateData.financialSituation = req.body.financialSituation;
    if (req.body.destination_degree) updateData.destination_degree = req.body.destination_degree;
    if (req.body.grade_avg) updateData.grade_avg = req.body.grade_avg;
    if (req.body.curriculum) updateData.curriculum = req.body.curriculum;
    if (req.body.grade) updateData.grade = req.body.grade;
    if (req.body.stream) updateData.stream = req.body.stream;
    if (req.body.program) updateData.program = req.body.program;
    if (req.body.university) updateData.university = req.body.university;
    if (req.body.personality) updateData.personality = req.body.personality

    let updatePathData = await pathModel.findOneAndUpdate({ _id: req.params.id }, updateData, { new: true });
    // console.log(updateStepData)
    if (!updatePathData) {
        return res.json({
            status: false,
            message: 'Data not found',
        })
    }
    return res.json({
        status: true,
        message: 'Path updated',
        data: updatePathData
    })

}

const deletePath = async (req, res) => {
    let deletePathData = await pathModel.findOneAndUpdate({ _id: req.params.id}, { status: "delete" }, { new: true });
    if (!deletePathData) {
        return res.json({
            status: false,
            message: 'Data not found',
        })
    }
    return res.json({
        status: true,
        message: 'path deleted',
        data: deletePathData
    })
}

const restorePath = async (req, res) => {
    let restorePathData = await pathModel.findOneAndUpdate({ _id: req.params.id, status: "delete" }, { status: "active" }, { new: true });
    if (!restorePathData) {
        return res.json({
            status: false,
            message: 'Data not found',
        })
    }
    return res.json({
        status: true,
        message: 'Step restored',
        data: restorePathData
    })
}


// YourModel.updateMany({}, { $set: { city: 'Hyderabad' } }, (err, result) => {
//     if (err) {
//       console.error(err);
//     } else {
//       console.log(`Updated ${result.nModified} documents`);
//     }


const updateFields = async (req, res) => {
    let updateAll = await pathModel.updateMany({}, { $set: { personality: "realistic" } }, { new: true });
    if (!updateAll) {
        return res.json({
            status: false,
            message: 'Data not found',
        })
    }
    return res.json({
        status: true,
        message: 'Details updated',
        data: updateAll
    })
}

module.exports = {
    addPath,
    getPath,
    updatePath,
    deletePath,
    restorePath,
    getPathSpecific,
    getPathNormal,
    updateFields
}
