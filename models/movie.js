
const mongoose = require('mongoose');
const Joi = require('joi');
const { genreSchema } = require('./genre');

const Movie = mongoose.model('Movie', new mongoose.Schema({

  title: {
    type: String,
    required: true,
    trim: true,
    minLength: 5,
    maxLength: 250
  },
  genre: {
    type: genreSchema,
    required: true
  },
  numberInStock: {
    type: Number,
    required: true,
    minLength: 0,
    maxLength: 255
  },
  dailyRentalRate: {
    type: Number,
    required: true,
    minLength: 0,
    maxLength: 255
  }
}));

function validationMovie(movie) {
  const schema = {
    title: Joi.string().min(5).max(50).required(),
    genreId: Joi.objectId().required(),
    numberInStock: Joi.number().min(0).required(),
    dailyRentalRate: Joi.number().min(0).required()
  }

  return Joi.validate(movie, schema);
}

exports.validationMovie = validationMovie;
exports.Movie = Movie;