const personalityQuesModel = require('../models/personalityQues.model')


const addQues = async (req, res) => {
    let existingQues = await personalityQuesModel.findOne({ question: req.body.question, status: "active" });

    if (existingQues) {
        return res.status(400).json({
            status: false,
            message: 'question already exists',
        });
    }


    let addQuestion = {
        question: req.body.question,
        relatedTo: req.body.relatedTo
    }

    let questionDetail = await personalityQuesModel.create(addQuestion)
    if (questionDetail) {
        return res.json({
            status: true,
            message: "Question Added",
            data: questionDetail
        })
    }
}



const getQuestion = async (req, res) => {
    let filter = {}
    if (req.query.status) {
        filter.status = req.query.status;
        if (req.query.status == "all")
            filter = {};
    } else {
        filter.status = "active";
    }
    if (req.query.questionId) filter._id = req.query.questionId;
    if (req.query.relatedTo) filter.relatedTo = req.query.relatedTo;

    let questionData = await personalityQuesModel.aggregate([
        {
             $match:filter
        },
        {
            $sample: { size: 48 }
        }
    ])
    if (questionData.length === 0) {
        return res.json({
            status: false,
            message: "question not found"
        })
    }
    res.json({
        status: true,
        count: questionData.length,
        message: "Question Data",
        data: questionData
    })
}


module.exports = {
    addQues,
    getQuestion
}
