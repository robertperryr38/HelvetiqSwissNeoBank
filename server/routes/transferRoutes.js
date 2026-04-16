const express = require('express');
const router = express.Router();
const { createTransfer, getAdminTransfers, processTransfer } = require('../controllers/transferController');

router.post('/transfer', createTransfer);
router.get('/admin/transfers', getAdminTransfers);
router.post('/admin/transfer/:id/process', processTransfer);

module.exports = router;
