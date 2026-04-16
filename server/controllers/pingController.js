const ping = (req, res) => {
  res.json({ message: 'pong' });
};

module.exports = { ping };
