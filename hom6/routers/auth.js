require('dotenv').config();
const express = require('express');
const authRouter = express.Router();
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const SECRET_KEY = process.env.SECRET_KEY;

const usersList = path.join(__dirname, '../model', 'users.json');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../img'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + extension);
  }
});

const upload = multer({ storage: storage });

authRouter.post('/register', upload.single("image"), (req, res) => {
  const { username, email, password } = req.body;
  const imagePath = req.file ? `/img/${req.file.filename}` : '';

  const users = JSON.parse(fs.readFileSync(usersList));

  if (username && email && password) {
    const existUser = users.find((u) => u.email === email);

    if (existUser) {
      return res.status(409).json({ message: 'User already exist' });
    }
    const newUser = {
      username,
      email,
      password,
      image: imagePath
    }

    users.push(newUser);
    fs.writeFileSync(usersList, JSON.stringify(users, null, 2));

    res.status(201).json({ message: 'User successfuly added' });
  }
});

authRouter.post('/login', (req, res) => {
  const { email, password } = req.body;
  const users = JSON.parse(fs.readFileSync(usersList));

  console.log(email, password);
  const user = users.find((u) => u.email === email);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  if (user.password !== password) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  const token = jwt.sign({ email: user.email }, SECRET_KEY, {
    expiresIn: 60 * 60,
  });

  res.status(200).json({ token });
});

module.exports = authRouter;