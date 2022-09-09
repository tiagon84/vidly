
const mongoose = require('mongoose');
const Joi = require('joi');
const Rental = mongoose.model('Rental', new mongoose.Schema({

  customer: {
    type: new mongoose.Schema({
      name: {
        type: String,
        required: true,
        minLength: 5,
        maxLength: 50
      },
      isGold: {
        type: Boolean,
      },
      phone: {
        type: String,
        required: true,
        minLength: 6,
        maxLength: 20
      }
    }),
    required: true,
  },
  movie: {
    type: new mongoose.Schema({
      title: {
        type: String,
        required: true,
        trim: true,
        minLength: 5,
        maxLength: 250
      },
      dailyRentalRate: {
        type: Number,
        required: true,
        min: 0,
        max: 255
      }
    }),
    required: true
  },
  dateOut: {
    type: Number,
    required: true,
    default: Date.now
  },
  dateReturned: {
    type: Date
  },
  rentalFee: {
    type: Number,
    min: 0,
  }
}));

function validationRental(rental) {
  const schema = {
    customerId: Joi.objectId().required(),
    movieId: Joi.objectId().required(),
  }

  return Joi.validate(rental, schema);
}

exports.validationRental = validationRental;
exports.Rental = Rental;