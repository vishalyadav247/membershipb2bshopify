const express = require('express');
const router = express.Router();
const allControlers = require('../controllers/auth-controllers');
const authenticate = require('../middlewares/authenticate');

router.post('/create-company',allControlers.createCompany);
router.post('/get-company-status',allControlers.companyStatus);
router.post('/update-company',allControlers.updateCompany);

router.get('/get-users',authenticate, allControlers.getCustomer);
router.put('/update-user/:id',allControlers.updateCustomer);
router.delete('/delete-enquiries',allControlers.deleteMultipleCompanies);
router.delete('/delete-company/:id',allControlers.deleteCompany);

router.post('/user-login',allControlers.userLogin);
router.get('/validate-user',authenticate,allControlers.validateUser);
router.post('/logout',authenticate,allControlers.logoutUser);
router.put('/change-password',authenticate,allControlers.updatePassword);

module.exports = router; 