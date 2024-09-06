const mongoose = require('mongoose');

const createCompanySchema = new mongoose.Schema({
    firstName:{
        type:String
    },
    lastName:{
        type:String
    },
    phone:{
        type:String 
    },
    email:{
        type:String
    },
    address:{
        type:String
    },
    city:{
        type:String
    },
    state:{
        type:String
    },
    zip:{
        type:String
    },
    countryCode:{
        type:String
    },
    dueDate:{
        type:String
    },
    relationship:{
        type:String
    },
    customerId:{
        type:String
    },
    companyId:{
        type:String
    },
    locationId:{
        type:String
    },
    companyRoleId:{
        type:String
    },
    companyContactId:{
        type:String
    },
    newsletter:{
        type:String
    },
    submittionDate:{
        type:String
    }
})

const createCompanyDb = mongoose.model('Membership Form',createCompanySchema);

module.exports = createCompanyDb;