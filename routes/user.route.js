const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const ms = require('ms');
const { protect, authorize } = require('../middleware/auth');

const USERS_DATABASE = [
  {
    id: 1,
    username: 'saleh',
    password: '123456',
    role: 'admin',
  },
  {
    id: 2,
    username: 'ali',
    password: '123456',
    role: 'user',
  },
  {
    id: 3,
    username: 'khalid',
    password: '123456',
    role: 'superuser',
  },
];

router.get('/users', (req, res, next) => {
  res.json(USERS_DATABASE);
});

router.post('/login', async (req, res, next) => {
  const { username, password } = req.body;

  const user = USERS_DATABASE.find(
    (user) => user.username === username && user.password === password
  );

  if (!user) {
    return res.status(400).json({ message: 'Wrong username and password' });
  }

  const token = await jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    {
      expiresIn: '7d',
    }
  );

  res
    .cookie('token', token, { expires: new Date(Date.now() + ms('7d')) })
    .json({ message: 'Welcome' });
});

router.use(protect);

router.get('/logged', async (req, res, next) => {
  console.log(req.user);

  const user = USERS_DATABASE.find((user) => user.id === req.user.id);

  res.json({ message: `Hello ${user.username} who logged in` });
});

router.get('/admin', authorize('admin'), async (req, res, next) => {
  const user = USERS_DATABASE.find((user) => user.id === req.user.id);
  res.json({ message: `Hey ${user.username} with the role of ${user.role}` });
});

router.get(
  '/superuser',
  authorize('admin', 'superuser'),
  async (req, res, next) => {
    const user = USERS_DATABASE.find((user) => user.id === req.user.id);
    res.json({ message: `Hey ${user.username} with the role of ${user.role}` });
  }
);

module.exports = router;
