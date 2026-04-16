const { readDB, writeDB } = require('../storage');

const register = (req, res) => {
  const { login, password, fullName, passport } = req.body;

  // Validate input
  if (!login || !password || !fullName || !passport) {
    return res.status(400).json({ message: 'Логин, пароль, полное имя и паспорт обязательны' });
  }

  const db = readDB();

  // Check if user already exists
  if (db.users.find(u => u.login === login)) {
    return res.status(400).json({ message: 'Пользователь уже существует' });
  }

  // Create new user
  const newUser = {
    id: db.counters.userId++,
    login,
    password,
    fullName,
    status: 'pending',
    balance: 0, // Start with 0 balance
    cashback: 0, // Start with 0 cashback
  };

  db.users.push(newUser);

  // Create KYC record for passport verification
  const kyc = {
    id: db.counters.kycId++,
    userId: newUser.id,
    passportFront: passport,
    passportBack: passport,
    status: 'pending',
    createdAt: new Date().toISOString(),
  };

  db.kycRequests.push(kyc);

  writeDB(db);

  return res.status(201).json({
    message: 'User registered successfully',
    user: {
      id: newUser.id,
      login: newUser.login,
      fullName: newUser.fullName,
      status: newUser.status,
      balance: newUser.balance,
    },
    token: 'auth_token_' + newUser.id,
  });
};

const login = (req, res) => {
  const { login, password } = req.body;

  // Validate input
  if (!login || !password) {
    return res.status(400).json({ message: 'Логин и пароль обязательны' });
  }

  const db = readDB();

  // Find user
  const user = db.users.find(u => u.login === login && u.password === password);

  if (!user) {
    return res.status(401).json({ message: 'Неправильный логин или пароль' });
  }

  return res.json({
    message: 'Login successful',
    user: {
      id: user.id,
      login: user.login,
      fullName: user.fullName,
      status: user.status,
      balance: user.balance,
    },
    token: 'auth_token_' + user.id,
  });
};

const getMe = (req, res) => {
  const userId = parseInt(req.headers['user-id']);

  // Validate userId
  if (!userId) {
    return res.status(400).json({ error: 'User ID required in headers' });
  }

  const db = readDB();

  // Find user
  const user = db.users.find(u => u.id === userId);

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  return res.json({
    id: user.id,
    login: user.login,
    fullName: user.fullName,
    status: user.status,
    balance: user.balance,
  });
};

const getAllUsers = (req, res) => {
  const db = readDB();
  return res.json(db.users);
};

const updateBalance = (req, res) => {
  const { id } = req.params;
  const { balance } = req.body;
  const userId = parseInt(id);

  const db = readDB();

  const user = db.users.find(u => u.id === userId);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  user.balance = parseFloat(balance);
  writeDB(db);

  return res.json({ message: 'Balance updated', user });
};

const approveUser = (req, res) => {
  const { id } = req.params;
  const userId = parseInt(id);

  const db = readDB();

  const user = db.users.find(u => u.id === userId);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  user.status = 'approved';
  writeDB(db);

  return res.json({ message: 'User approved', user });
};

const blockUser = (req, res) => {
  const { id } = req.params;
  const userId = parseInt(id);

  const db = readDB();

  const user = db.users.find(u => u.id === userId);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  user.status = 'rejected';
  writeDB(db);

  return res.json({ message: 'User blocked', user });
};

module.exports = { register, login, getMe, getAllUsers, updateBalance, approveUser, blockUser };
