const mongoose = require('mongoose');
const Joi = require('joi');

const Customer = mongoose.model('Customer', new mongoose.Schema({

  isGold: {
    type: Boolean,
  },
  name: {
    type: String,
    required: true,
    minLength: 5,
    maxLength: 50
  },
  phone: {
    type: String,
    required: true,
    minLength: 6,
    maxLength: 20
  }
}));

function validationCustomer(customer) {
  const schema = {
    isGold: Joi.boolean(),
    name: Joi.string().min(3).required(),
    phone: Joi.string().min(3)
  }

  return Joi.validate(customer, schema);
}

exports.Customer = Customer;
exports.validationCustomer = validationCustomer;
