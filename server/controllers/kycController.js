const { readDB, writeDB } = require('../storage');

const createKyc = (req, res) => {
  const { userId, passportFront, passportBack } = req.body;

  // Validate input
  if (!userId || !passportFront || !passportBack) {
    return res.status(400).json({ error: 'userId, passportFront and passportBack required' });
  }

  const db = readDB();

  // Check if user exists
  const user = db.users.find(u => u.id === userId);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  // Check if user already has pending or approved KYC
  const existingKyc = db.kycRequests.find(
    k => k.userId === userId && (k.status === 'pending' || k.status === 'approved')
  );
  if (existingKyc) {
    return res.status(400).json({ error: 'KYC request already exists' });
  }

  // Check if user was rejected before
  const rejectedKyc = db.kycRequests.find(k => k.userId === userId && k.status === 'rejected');
  if (rejectedKyc) {
    return res.status(400).json({ error: 'You cannot submit KYC after rejection' });
  }

  // Create KYC request
  const kycRequest = {
    id: db.counters.kycId++,
    userId,
    passportFront,
    passportBack,
    status: 'pending',
  };

  db.kycRequests.push(kycRequest);
  writeDB(db);

  return res.status(201).json(kycRequest);
};

const getAllKyc = (req, res) => {
  const db = readDB();
  return res.json(db.kycRequests);
};

const approveKyc = (req, res) => {
  const { id } = req.params;
  const kycId = parseInt(id);

  const db = readDB();

  // Find KYC request
  const kycRequest = db.kycRequests.find(k => k.id === kycId);
  if (!kycRequest) {
    return res.status(404).json({ error: 'KYC request not found' });
  }

  // Update KYC status
  kycRequest.status = 'approved';

  // Update user status
  const user = db.users.find(u => u.id === kycRequest.userId);
  if (user) {
    user.status = 'approved';
  }

  writeDB(db);

  return res.json({ message: 'KYC approved', kycRequest });
};

const rejectKyc = (req, res) => {
  const { id } = req.params;
  const kycId = parseInt(id);

  const db = readDB();

  // Find KYC request
  const kycRequest = db.kycRequests.find(k => k.id === kycId);
  if (!kycRequest) {
    return res.status(404).json({ error: 'KYC request not found' });
  }

  // Update KYC status
  kycRequest.status = 'rejected';

  // Update user status
  const user = db.users.find(u => u.id === kycRequest.userId);
  if (user) {
    user.status = 'rejected';
  }

  writeDB(db);

  return res.json({ message: 'KYC rejected', kycRequest });
};

module.exports = { createKyc, getAllKyc, approveKyc, rejectKyc };
