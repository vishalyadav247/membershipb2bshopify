const express = require('express');
const router = express.Router();
const allControlers = require('../controllers/auth-controllers')

router.post('/create-company',allControlers.createCompany)
router.post('/get-company-status',allControlers.companyStatus)
router.post('/update-company',allControlers.updateCompany)

router.get('/get-users',allControlers.getCustomer)
router.put('/update-user/:id',allControlers.updateCustomer)
router.get('/get-users/:id', allControlers.getCustomerById)
module.exports = router; 