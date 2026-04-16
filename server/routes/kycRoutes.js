const express = require('express');
const router = express.Router();
const { createKyc, getAllKyc, approveKyc, rejectKyc } = require('../controllers/kycController');

router.post('/kyc', createKyc);
router.get('/admin/kyc', getAllKyc);
router.post('/admin/kyc/:id/approve', approveKyc);
router.post('/admin/kyc/:id/reject', rejectKyc);

module.exports = router;
