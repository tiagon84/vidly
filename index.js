const express = require('express');
const mongoose = require('mongoose');
const genresRouter = require('./routes/genres');
const customerRouter = require('./routes/customers');
const movieRouter = require('./routes/movies');
const rentalRouter = require('./routes/rentals');
const userRouter = require('./routes/users');
const authRouter = require('./routes/auth');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

const app = express();
app.use(express.json());
app.use('/api/genres', genresRouter);
app.use('/api/customers', customerRouter);
app.use('/api/movies', movieRouter);
app.use('/api/rentals', rentalRouter);
app.use('/api/users', userRouter);
app.use('/api/auth', authRouter);

mongoose.connect('mongodb://localhost/vidly')
  .then(console.log('Connected to mongodb!'))
  .catch(console.error('Could not connect to mongodb'))

app.listen(3000, () => console.log('Listening on port 3000...'));
