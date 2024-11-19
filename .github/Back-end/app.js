
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
require('./Models/connection');
const userRoutes = require('./Routes/Userrouter');
require('dotenv').config();
const bookArr = require('./Models/BookApi.js');
const BookModel = require('./Models/Book.model.js');
const AdminRouter = require('./Routes/Adminroter.js');

const app = express();

app.use(cors());
app.use(cookieParser());
app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));
app.use(express.static('public'));
app.use('/api/users', userRoutes);
app.use('/api/book', AdminRouter);

app.listen(3002, () => {
  console.log('Server running at http://localhost:3002');
});
