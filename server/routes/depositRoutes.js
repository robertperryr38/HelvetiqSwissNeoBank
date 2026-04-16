const express = require('express');
const router = express.Router();
const { createDeposit, getAdminDeposits, processDeposit, getUserDeposits, creditDeposit } = require('../controllers/depositController');

router.post('/deposit', createDeposit);
router.get('/admin/deposits', getAdminDeposits);
router.post('/admin/deposit/:id/process', processDeposit);
router.post('/admin/deposit/:id/credit', creditDeposit);
router.get('/user/deposits', getUserDeposits);

module.exports = router;
