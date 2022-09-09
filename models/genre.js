

const Joi = require('joi');
const mongoose = require('mongoose');

const genreSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: 5,
    maxLength: 50
  }
});
const Genre = mongoose.model('Genre', genreSchema);

function validationGenre(genre) {
  const schema = {
    name: Joi.string().min(3).required()
  };

  return Joi.validate(genre, schema);
}

exports.validationGenre = validationGenre;
exports.genreSchema = genreSchema;
exports.Genre = Genre;