const express = require('express');
const router = express.Router();
const { getUserTransactions, createTransaction } = require('../controllers/transactionController');

router.get('/transactions', getUserTransactions);
router.post('/transaction', createTransaction);

module.exports = router;