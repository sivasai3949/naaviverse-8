const stepModel = require('../models/steps.model');
const pathModel = require('../models/path.model');
const axios = require('axios');

const addStep = async (req, res) => {
    // console.log(req.body.country)
    // let existingPath = await pathModel.findOne({ _id: req.body.path_id });
    // if (!existingPath) {
    //     return res.json({
    //         status: false,
    //         message: 'Path not found',
    //     })
    // }
    
    let createStep = {
        email: req.body.email,
        name: req.body.name,
        micro_description: req.body.micro_description,
        micro_name: req.body.micro_name,
        micro_length: req.body.micro_length,
        micro_cost: req.body.micro_cost,
        micro_chances: req.body.micro_chances,
        microservices: req.body.microservices,
        macro_description: req.body.macro_description,
        macro_name: req.body.macro_name,
        macro_length: req.body.macro_length,
        macro_cost: req.body.macro_cost,
        macro_chances: req.body.macro_chances,
        macroservices: req.body.macroservices,
        nano_description: req.body.nano_description,
        nano_name: req.body.nano_name,
        nano_length: req.body.nano_length,
        nano_cost: req.body.nano_cost,
        nano_chances: req.body.nano_chances,
        nanoservices: req.body.nanoservices,
        step_order: req.body.step_order,
        path_id: req.body.path_id,
        status: req.body.status
    }
    let step = await stepModel.create(createStep);

    // if (existingPath) {
    //     console.log(existingPath.the_ids);
        
    //     existingPath.the_ids.push(step._id);
        
    //     console.log(existingPath.the_ids);
    //     await existingPath.save();    
    // }
    if (!step) {
        return res.json({
            status: false,
            message: 'Error in creating step',
        })
    }
    return res.json({
        status: true,
        message: 'Step created',
        data: step
    })
}

const getSteps = async (req, res) => {
    let filter = {}
    if (req.query.status) {
        filter.status = req.query.status;
        if (req.query.status == "all")
            filter = {};
    } else {
        filter.status = "active";
    }
    if (req.query.name) filter.name = req.query.name;
    if (req.query.email) filter.email = req.query.email;
    if (req.query.step_id) filter._id = req.query.step_id;
    if (req.query.length) filter.length = req.query.length

    let steps = await stepModel.aggregate([
        {
            $match: filter
        },
        {
            $sort: { "createdAt": -1 }
        },
        {
            $lookup: {
                from: "naavi_services",
                let: { "m_ids": "$macroservices" },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    { $in: ["$_id", "$$m_ids"] },
                                ],
                            }
                        }
                    },
                ],
                as: "MacroServicesDetails"
            }
        },
        {
            $lookup: {
                from: "naavi_services",
                let: { "mi_ids": "$microservices" },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    { $in: ["$_id", "$$mi_ids"] },
                                ],
                            }
                        }
                    },
                ],
                as: "MicroServicesDetails"
            }
        },
        {
            $lookup: {
                from: "naavi_services",
                let: { "n_ids": "$nanoservices" },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    { $in: ["$_id", "$$n_ids"] },
                                ],
                            }
                        }
                    },
                ],
                as: "nanoServicesDetails"
            }
        },
        {
            $lookup: {
                from: "paths",
                let: { "p_id": "$path_id" },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    { $eq: ["$_id", "$$p_id"] },
                                ],
                            }
                        }
                    },
                ],
                as: "pathDetails"
            }
        },

    ]);


    if (steps.length === 0) {
        return res.json({
            status: false,
            message: 'No data found',
        })
    }
    return res.json({
        status: true,
        total: steps.length,
        message: 'Steps data found',
        data: steps
    })
}

const updateStep = async (req, res) => {
    let updateData = {}
    if (req.body.name) updateData.name = req.body.name;
    if (req.body.macro_name) updateData.macro_name = req.body.macro_name;
    if (req.body.micro_name) updateData.micro_name = req.body.micro_name;
    if (req.body.nano_name) updateData.nano_name = req.body.nano_name;
    if (req.body.macro_length) updateData.macro_length = req.body.macro_length;
    if (req.body.micro_length) updateData.micro_length = req.body.micro_length;
    if (req.body.nano_length) updateData.nano_length = req.body.nano_length;
    if (req.body.macro_chances) updateData.macro_chances = req.body.macro_chances;
    if (req.body.micro_chances) updateData.micro_chances = req.body.micro_chances;
    if (req.body.nano_chances) updateData.nano_chances = req.body.nano_chances;
    if (req.body.macro_description) updateData.macro_description = req.body.macro_description;
    if (req.body.micro_description) updateData.micro_description = req.body.micro_description;
    if (req.body.nano_description) updateData.nano_description = req.body.nano_description;
    if (req.body.microservices) updateData.microservices = req.body.microservices;
    if (req.body.macroservices) updateData.macroservices = req.body.macroservices;
    if (req.body.nanoservices) updateData.nanoservices = req.body.nanooservices;
    if (req.body.macro_cost) updateData.macro_cost = req.body.macro_cost;
    if (req.body.micro_cost) updateData.micro_cost = req.body.micro_cost;
    if (req.body.nano_cost) updateData.nano_cost = req.body.nano_cost;
    if (req.body.step_order) updateData.step_order = req.body.step_order;
    if (req.body.path_id) updateData.path_id = req.body.path_id;
    if (req.body.status) updateData.status = req.body.status;

    let updateStepData = await stepModel.findOneAndUpdate({ _id: req.params.id, status: "active" }, updateData, { new: true });
    // console.log(updateStepData)
    if (!updateStepData) {
        return res.json({
            status: false,
            message: 'Data not found',
        })
    }
    return res.json({
        status: true,
        message: 'Step updated',
        data: updateStepData
    })

}


const deleteStep = async (req, res) => {
    try {
        const stepId = req.params.id; // Extract the step ID from request parameters

        // Check if the step exists in the database
        const step = await stepModel.findById(stepId);

        if (!step) {
            return res.status(404).json({
                status: false,
                message: 'Step not found',
            });
        }

        if (step.status === "active") {
            // Soft delete for active steps (move to inactive)
            const updatedStep = await stepModel.findByIdAndUpdate(
                stepId,
                { status: "inactive" }, // Change status to inactive
                { new: true }
            );
            return res.status(200).json({
                status: true,
                message: 'Step moved to Inactive Steps',
                data: updatedStep,
            });
        } else if (step.status === "inactive") {
            // Permanently delete steps already marked as inactive
            const deletedStep = await stepModel.findByIdAndDelete(stepId);
            return res.status(200).json({
                status: true,
                message: 'Step permanently deleted',
                data: deletedStep,
            });
        } else {
            // Handle invalid or unexpected statuses
            return res.status(400).json({
                status: false,
                message: 'Invalid step status. Use "active" or "inactive".',
            });
        }
    } catch (error) {
        console.error("Error in deleteStep:", error);
        return res.status(500).json({
            status: false,
            message: 'An error occurred while processing the request.',
        });
    }
};



const restoreStep = async (req, res) => {
    let restoreStepData = await stepModel.findOneAndUpdate({ _id: req.params.id, status: "delete" }, { status: "active" }, { new: true });
    if (!restoreStepData) {
        return res.json({
            status: false,
            message: 'Data not found',
        })
    }
    return res.json({
        status: true,
        message: 'Step restored',
        data: restoreStepData
    })
}

module.exports = {
    addStep,
    getSteps,
    updateStep,
    deleteStep,
    restoreStep,
}
