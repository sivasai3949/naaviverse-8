const serviceModel = require('../models/services.model');
const axios = require('axios');

const addService = async (req, res) => {
    // console.log(req.body.country)
    let existingStep = await serviceModel.findOne({ nameOfService: req.body.nameOfService });
    if (existingStep) {
        return res.json({
            status: false,
            message: 'Service already exists',
        })
    }

    let createService = {
        email: req.body.email,
        nameOfService: req.body.nameOfService,
        icon: req.body.icon,
        description: req.body.description,
        serviceProvider: req.body.serviceProvider,
        access: req.body.access,
        goal: req.body.goal,
        grade: req.body.gradeData,
        financialSituation: req.body.financialData,
        stream: req.body.stream,
        cost: req.body.cost,
        price: req.body.price,
        discountType: req.body.discountType,
        discountAmount: req.body.discountAmount,
        duration: req.body.duration,
        features: req.body.features,
        status: req.body.status,
        outcome: req.body.outcome,
        type: req.body.type,
        iterations: req.body.iterations
    }
    let step = await serviceModel.create(createService);
    if (!step) {
        return res.json({
            status: false,
            message: 'Error in creating service',
        })
    }
    return res.json({
        status: true,
        message: 'Service created',
        data: step
    })
}

const getServices = async (req, res) => {
    let filter = {}
    if (req.query.status) {
        filter.status = req.query.status;
        if (req.query.status == "all")
            filter = {};
    } else {
        filter.status = "active";
    }
    if (req.query.email) filter.email = req.query.email;
    if (req.query.type) filter.type = req.query.type;
    if (req.query.cost) filter.cost = req.query.cost;
    
    let services = await serviceModel.find(filter);
    if (services.length === 0) {
        return res.json({
            status: false,
            message: 'No data found',
        })
    }
    return res.json({
        status: true,
        total: services.length,
        message: 'Service data found',
        data: services
    })
}

const updateService = async (req, res) => {
    let updateData = {}
    if (req.body.nameOfService) updateData.nameOfService = req.body.nameOfService;
    if (req.body.grade) updateData.grade = req.body.grade;
    if(req.body.description) updateData.description = req.body.description;
    if(req.body.financialSituation) updateData.financialSituation = req.body.financialSituation;
    if(req.body.stream) updateData.stream = req.body.stream;
    if(req.body.serviceProvider) updateData.serviceProvider = req.body.serviceProvider;
    if(req.body.access) updateData.access = req.body.access;
    if(req.body.goal) updateData.goal = req.body.goal;
    if(req.body.icon) updateData.icon = req.body.icon;
    if (req.body.cost) updateData.cost = req.body.cost;
    if (req.body.price) updateData.price = req.body.price;
    if (req.body.discountType) updateData.discountType = req.body.discountType;
    if (req.body.discountAmount) updateData.discountAmount = req.body.discountAmount;
    if (req.body.duration) updateData.duration = req.body.duration;
    if (req.body.features) updateData.features = req.body.features;
    if (req.body.status) updateData.status = req.body.status;
    if (req.body.outcome) updateData.outcome = req.body.outcome;
    if (req.body.type) updateData.type = req.body.type;
    if (req.body.program) updateData.program = req.body.program;

    let updateServiceData = await serviceModel.findOneAndUpdate({ _id: req.params.id}, updateData, { new: true });
    // console.log(updateStepData)
    if (!updateServiceData) {
        return res.json({
            status: false,
            message: 'Data not found',
        })
    }
    return res.json({
        status: true,
        message: 'Service updated',
        data: updateServiceData
    })

}

const deleteService = async (req, res) => {
    let deleteServiceData = await serviceModel.findOneAndUpdate({ _id: req.params.id }, { status: "delete" }, { new: true });
    if (!deleteServiceData) {
        return res.json({
            status: false,
            message: 'Data not found',
        })
    }
    return res.json({
        status: true,
        message: 'Service deleted',
        data: deleteServiceData
    })
}

const restoreService = async (req, res) => {
    let restoreServiceData = await serviceModel.findOneAndUpdate({ _id: req.params.id, status: "delete" }, { status: "active" }, { new: true });
    if (!restoreServiceData) {
        return res.json({
            status: false,
            message: 'Data not found',
        })
    }
    return res.json({
        status: true,
        message: 'Service restored',
        data: restoreServiceData
    })
}


module.exports = {
    addService,
    getServices,
    updateService,
    deleteService,
    restoreService,
}
