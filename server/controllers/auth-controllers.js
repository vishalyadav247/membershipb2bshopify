require('dotenv').config();
const createCompanyDb = require('../models/user-models')
const accessToken = process.env.STORE_API_PASSWORD;
const url = process.env.STORE_GRAPHQL_URL;


const nodemailer = require('nodemailer');
const ejs = require('ejs');
const path = require('path');

const user = process.env.EMAIL_USER;
const pass = process.env.EMAIL_PASS;

const sendEmail = async (emailData) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail', // Use your preferred service
        auth: {
            user: user,
            pass: pass
        }
    });

    const templatePath = path.resolve(__dirname, '../views/emailTemplate.ejs');
    const html = await ejs.renderFile(templatePath, { data: emailData });

    const mailOptions = {
        from: 'webmaster@justgoweb.com',
        to: emailData.email,
        subject: 'New Company Registration',
        html: html
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
        } else {
            console.log('Email sent:', info.response);
        }
    });
};



const createCompany = async (req, res) => {
    const request = await req.body;
    let otherData = {}
    try {
        // Step 1: Create Company and Fetch IDs
        const query1 = `
            mutation CompanyCreate($input: CompanyCreateInput!) {
                companyCreate(input: $input) {
                    company {
                        id
                        locations(first: 1) {
                            edges {
                                node {
                                    id
                                }
                            }
                        }
                        contactRoles(first: 1) {
                            edges {
                                node {
                                    id
                                }
                            }
                        }
                    }
                    userErrors {
                        field
                        message
                        code
                    }
                }
            }`;

        const variables1 = {
            input: {
                company: {
                    name: request.firstName,
                    externalId: request.firstName
                },
                companyLocation: {
                    name: request.firstName,
                    shippingAddress: {
                        firstName: request.firstName,
                        lastName: request.lastName,
                        address1: "",
                        city:"",
                        zoneCode: "",
                        zip: "",
                        countryCode: request.countryCode
                    },
                    billingSameAsShipping: true
                }
            }
        };

        let response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Shopify-Access-Token': accessToken
            },
            body: JSON.stringify({ query: query1, variables: variables1 })
        });

        let data = await response.json();

        if (!data.data || !data.data.companyCreate) {
            throw new Error(data.errors ? data.errors.map(e => e.message).join(', ') : 'Unknown error in creating company');
        }

        const company = data.data.companyCreate.company;
        if (!company) {
            throw new Error('Company creation failed. No company object returned.');
        }
        const locationEdge = company.locations.edges[0];
        if (!locationEdge) {
            throw new Error('No location returned for the company.');
        }
        const roleEdge = company.contactRoles.edges[0];
        if (!roleEdge) {
            throw new Error('No role returned for the company.');
        }
        
        const roleId = roleEdge.node.id;
        const companyId = company.id;
        const locationId = locationEdge.node.id;
        otherData.companyRoleId = roleId;
        otherData.companyId = companyId;
        otherData.locationId = locationId;

        // Step 2: Link Customer to Company
        const query2 = `
            mutation assignCustomerToCompany($companyId: ID!, $customerId: ID!) {
                companyAssignCustomerAsContact(companyId: $companyId, customerId: $customerId) {
                    companyContact {
                        id
                    }
                    userErrors {
                        field
                        message
                    }
                }
            }`;

        const variables2 = {
            companyId: companyId,
            customerId: request.customerId
        };

        response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Shopify-Access-Token': accessToken
            },
            body: JSON.stringify({ query: query2, variables: variables2 })
        });

        
        data = await response.json();

        if (!data.data || !data.data.companyAssignCustomerAsContact) {
            if (data.errors) {
                console.error('API Errors:', data.errors);
                throw new Error(data.errors.map(e => e.message).join(', '));
            }
            if (data.data && data.data.companyAssignCustomerAsContact.userErrors.length > 0) {
                throw new Error(data.data.companyAssignCustomerAsContact.userErrors.map(e => e.message).join(', '));
            }
            throw new Error('Unknown error in linking customer');
        }

        const companyContact = data.data.companyAssignCustomerAsContact.companyContact;
        if (!companyContact) {
            throw new Error('Linking customer to company failed. No company contact returned.');
        }

        const companyContactId = companyContact.id;
        otherData.companyContactId = companyContactId;

        // // Step 3: Assign Role to Company Contact
        const query3 = `
            mutation assignRoleToCompanyContact($companyContactId: ID!, $rolesToAssign: [CompanyContactRoleAssign!]!) {
                companyContactAssignRoles(companyContactId: $companyContactId, rolesToAssign: $rolesToAssign) {
                    roleAssignments {
                        role {
                            id
                            name
                        }
                    }
                    userErrors {
                        field
                        message
                    }
                }
            }`;

        const variables3 = {
            companyContactId: companyContactId,
            rolesToAssign: [
                {
                    companyContactRoleId: roleId,
                    companyLocationId: locationId
                }
            ]
        };

        response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Shopify-Access-Token': accessToken
            },
            body: JSON.stringify({ query: query3, variables: variables3 })
        });

        data = await response.json();

        if (data.errors) {
            throw new Error(data.errors.map(e => e.message).join(', '));
        }

// Assuming 'request' is your incoming object that includes the 'newsletter' field
if (request.newsletter === "on") {
    // Define the GraphQL query and variables for updating email marketing consent
    const marketingConsentQuery = `
        mutation customerEmailMarketingConsentUpdate($input: CustomerEmailMarketingConsentUpdateInput!) {
            customerEmailMarketingConsentUpdate(input: $input) {
                customer {
                    id
                }
                userErrors {
                    field
                    message
                }
            }
        }`;

    const marketingConsentVariables = {
        input: {
            customerId: request.customerId,
            emailMarketingConsent: {
                consentUpdatedAt: "2019-09-07T15:50:00Z", // Update the timestamp to the current time
                marketingOptInLevel: "CONFIRMED_OPT_IN",
                marketingState: "SUBSCRIBED"
            }
        }
    };

    // Execute the GraphQL mutation using fetch
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Shopify-Access-Token': accessToken
        },
        body: JSON.stringify({ query: marketingConsentQuery, variables: marketingConsentVariables })
    })
    .then(response => response.json())
    .then(data => {
        if (data.errors) {
            console.error('Error updating marketing consent:', data.errors);
        } else {
            console.log('Marketing consent updated successfully:', data.data.customerEmailMarketingConsentUpdate.customer);
        }
    })
    .catch(error => {
        console.error('Error sending request:', error);
    });
}




        let dbData = {...request,...otherData}
        const date = new Date();
        const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
        const formatted = date.toLocaleDateString('en-CA', options);
        const initialData = {
            firstName:dbData.firstName,
            lastName:dbData.lastName,
            email:dbData.customerEmail,
            countryCode:dbData.countryCode,
            dueDate:dbData.dueDate,
            relationship:dbData.relationship,
            customerId:dbData.customerId,
            companyId:dbData.companyId,
            locationId:dbData.locationId,
            companyRoleId:dbData.companyRoleId,
            companyContactId:dbData.companyContactId,
            newsletter:dbData.newsletter,
            submittionDate:formatted,

        }
        const newEntry = new createCompanyDb(initialData);
        newEntry.save()
        await sendEmail(initialData);
        res.status(200).json({message:'company created',formData:dbData })

    } catch (error) {
        console.error('Error:', error);
    }
}

const companyStatus = async (req,res) => {
    const request = await req.body;
    try {
        const check = await createCompanyDb.findOne({customerId: `gid://shopify/Customer/${request.id}`});
        if(check != null){
            res.status(200).json({message:'user found', object:check});
        }else{
            res.status(401).json({message:'user not found in db'});
        }
    } catch (error) {
        
    }
}

const updateCompany = async (req,res)=>{
    let response = await req.body;
    try {
        const updatedEnquiry = await createCompanyDb.findByIdAndUpdate(
            response.id,
            {
                $set: {
                    relationship: response.relationship,
                    dueDate: response.due,
                }
            },
            { new: true, runValidators: true } // Options to return the updated document and run validation
        );
        if (!updatedEnquiry) {
            return res.status(404).json({message:'Enquiry not found'});
        }

        res.status(200).json({message:'Enquiry updated successfully'});
    } catch (error) {
        
    }

}

const getCustomer = async(req,res)=>{
    try {
        let response = await createCompanyDb.find();
        if(!response){
            return res.status(404).send({message:'no user found'})
        }
        return res.status(200).send(response)
    } catch (error) {
        return res.status(500).send({message:'error in fetching users',error:error})
    }
}

const updateCustomer = async (req, res) => {
    try {
        const enquiryId = req.params.id;
        const updateData = req.body;
        const currentCustomer = await createCompanyDb.findByIdAndUpdate(
            enquiryId,
            {
                $set: {
                    dueDate: updateData.dueDate,
                    relationship: updateData.relationship,
                    comments: updateData.comments.map(comment => ({
                        comment_text: comment.comment_text,
                        comment_date: comment.comment_date
                    }))
                }
            },
            { new: true, runValidators: true } // Options to return the updated document and run validation
        );

        if (!currentCustomer) {
            return res.status(404).send('customer not found');
        }

        res.status(200).send('customer data updated successfully');
    } catch (error) {
        console.error('Error customer data:', error);
        res.status(500).send('Error updating customer data');
    }
}

module.exports = {createCompany,companyStatus,updateCompany, getCustomer, updateCustomer}; 

