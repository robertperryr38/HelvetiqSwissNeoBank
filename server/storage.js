const fs = require('fs');
const path = require('path');

const dbPath = process.env.DB_PATH || path.join(__dirname, 'db.json');

function ensureDBDirectory() {
  const directory = path.dirname(dbPath);
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
  }
}

function readDB() {
  ensureDBDirectory();

  if (!fs.existsSync(dbPath)) {
    const initialData = {
      counters: { userId: 1, kycId: 1, messageId: 1, depositId: 1, transferId: 1, transactionId: 1 },
      users: [],
      kycRequests: [],
      deposits: [],
      transfers: [],
      transactions: [],
      messages: [],
    };
    fs.writeFileSync(dbPath, JSON.stringify(initialData, null, 2));
    return initialData;
  }

  return JSON.parse(fs.readFileSync(dbPath, 'utf8'));
}

function writeDB(data) {
  ensureDBDirectory();
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}

module.exports = { readDB, writeDB };
