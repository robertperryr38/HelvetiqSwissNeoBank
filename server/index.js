const express = require('express');
const cors = require('cors');
const healthRoutes = require('./routes/healthRoutes');
const userRoutes = require('./routes/userRoutes');
const kycRoutes = require('./routes/kycRoutes');
const supportRoutes = require('./routes/supportRoutes');
const depositRoutes = require('./routes/depositRoutes');
const transferRoutes = require('./routes/transferRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const { login, approveUser } = require('./controllers/userController');
const { getAllKyc, approveKyc, rejectKyc } = require('./controllers/kycController');
const { getAdminDeposits, processDeposit, creditDeposit } = require('./controllers/depositController');
const { getAdminTransfers, processTransfer } = require('./controllers/transferController');
const { updateBalance, blockUser } = require('./controllers/userController');
const { sendMessage, getMessages } = require('./controllers/supportController');

const app = express();
const PORT = process.env.PORT || 3001;
const allowedOrigins = (process.env.FRONTEND_URL || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error('CORS origin not allowed'));
    },
  })
);
app.use(express.json());

app.use('/', healthRoutes);
app.use('/users', userRoutes);
app.use('/', kycRoutes);
app.use('/support', supportRoutes);
app.use('/', depositRoutes);
app.use('/', transferRoutes);
app.use('/', transactionRoutes);

app.post('/login', login);

app.get('/admin/kyc', getAllKyc);
app.post('/admin/kyc/:id/approve', approveKyc);
app.post('/admin/kyc/:id/reject', rejectKyc);
app.get('/admin/deposits', getAdminDeposits);
app.post('/admin/deposit/:id/process', processDeposit);
app.post('/admin/deposit/:id/credit', creditDeposit);
app.get('/admin/transfers', getAdminTransfers);
app.post('/admin/transfer/:id/process', processTransfer);
app.post('/admin/user/:id/balance', updateBalance);
app.post('/admin/user/:id/approve', approveUser);
app.post('/admin/user/:id/block', blockUser);
app.get('/admin/support/messages', getMessages);
app.post('/admin/support/message', sendMessage);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
