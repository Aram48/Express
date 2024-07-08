require('dotenv').config();
const express = require('express');
const path = require('path');
const PORT = process.env.PORT;
const authRouter = require('./routers/auth');
const app = express();
const { tokenValidation } = require('./config/validation');

app.set('view engine', 'ejs');
app.set(path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/register', (req, res) => {
  res.render('register');
});

app.get('/users', tokenValidation, (req, res) => {
  const user = req.user;
  res.render('users', { user: user.username });
});

app.get('/login', (req, res) => {
  res.render('login');
});

app.use('/api', authRouter);

app.listen(PORT, () => {
  console.log(`Server is runing on http://localhost:${PORT}`);
});
