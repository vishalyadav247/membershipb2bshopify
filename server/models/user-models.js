const mongoose = require('mongoose');

const createCompanySchema = new mongoose.Schema({
    firstName:{
        type:String
    },
    lastName:{
        type:String
    },
    email:{
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
    },
    comments: [{
        comment_text: { type: String },
        comment_date: { type: String }
    }]
})

const createCompanyDb = mongoose.model('Membership Form',createCompanySchema);

module.exports = createCompanyDb;