const config = require('config');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: 5,
    maxLength: 50
  },
  email: {
    type: String,
    required: true,
    minLength: 5,
    maxLength: 252,
    unique: true
  },
  password: {
    type: String,
    required: true,
    minLength: 5,
    maxLength: 1024
  },
  isAdmin: Boolean
});
userSchema.methods.generateAuthToken = function(){
  return jwt.sign({ _id: this._id, isAdmin: this.isAdmin }, config.get('jwtPrivateKey'));
}
const User = mongoose.model('User', userSchema);

function validationUser(user) {
  const schema = {
    name: Joi.string().min(5).max(255).required(),
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(255).required()
  };

  return Joi.validate(user, schema);
}

exports.validationUser = validationUser;
exports.User = User;