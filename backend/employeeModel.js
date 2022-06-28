const mongoose = require('mongoose')

const schema = mongoose.Schema({
    employeeData: 'Array'
},{timestamps: true})

const Employees = mongoose.model('Employee',schema)
module.exports = Employees