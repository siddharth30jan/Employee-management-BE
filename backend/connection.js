const mongoose = require('mongoose')
require('dotenv').config

const connectionParams = {
    useNewUrlParser: true,
    // useCreateIndex: true,
    useUnifiedTopology: true
}


const uri = "mongodb+srv://siddharths517:siddharths517@cluster0.pvtgv.mongodb.net/employeeTable?retryWrites=true&w=majority"

const connection = mongoose.connect(uri,connectionParams).then(()=> console.log('connected!')).catch(err=>console.log(err))

module.exports = connection