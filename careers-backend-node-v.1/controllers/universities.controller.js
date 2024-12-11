const universitiesModel = require('../models/universities.model');
const axios = require('axios');

const addUniversities = async (req, res) => {
    let universitiesData = await axios.get(`http://universities.hipolabs.com/search`)
    console.log(universitiesData.data)

    let universities = await universitiesModel.insertMany(universitiesData.data)
    if (!universities) {
        return res.json({
            status: false,
            message: 'Error in creating step',
        })
    }
    return res.json({
        status: true,
        message: 'Step created',
        data: universities
    })
}

const fetchUniversities = async (req, res) => {
    let filter = {}
    if (req.query.country) filter.country = req.query.country
    if (req.query.name) filter.name = req.query.name
    if (req.query.domains) filter.domains = req.query.domains
    if (req.query.alpha_two_code) filter.alpha_two_code = req.query.alpha_two_code
    if (req.query.state_province) filter.state_province = req.query.state_province
    if (req.query.web_pages) filter.web_pages = req.query.web_pages
    const page = parseInt(req.query.skip)
    const limit = parseInt(req.query.limit)
    const skip = (page - 1) * limit;
    if(!req.query.skip) delete filter.skip
    if(!req.query.limit) delete filter.limit
    let universities = await universitiesModel.find(filter).find(filter).skip(skip).limit(limit)
    console.log(filter)
    if (!universities) {
        return res.json({
            status: false,
            message: 'Error in fetching details',
        })
    }
    return res.json({
        status: true,
        message: 'Data fetched',
        total: universities.length,
        data: universities
    })
}



module.exports = {
    addUniversities,
    fetchUniversities
}