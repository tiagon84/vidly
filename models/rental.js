const mongoose = require('mongoose');
const moment = require('moment');
const Joi = require('joi');

const rentalSchema = new mongoose.Schema({
   customer: {
      type: new mongoose.Schema({
         name: {
            type: String,
            required: true,
            minLength: 5,
            maxLength: 50,
         },
         isGold: {
            type: Boolean,
            default: false,
         },
         phone: {
            type: String,
            required: true,
            minLength: 6,
            maxLength: 20,
         },
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
            maxLength: 250,
         },
         dailyRentalRate: {
            type: Number,
            required: true,
            min: 0,
            max: 255,
         },
      }),
      required: true,
   },
   dateOut: {
      type: Number,
      required: true,
      default: Date.now,
   },
   dateReturned: {
      type: Date,
   },
   rentalFee: {
      type: Number,
      min: 0,
   },
});

rentalSchema.statics.lookup = function (customerId, movieId) {
   return this.findOne({
      'customer._id': customerId,
      'movie._id': movieId,
   });
};

rentalSchema.methods.return = function () {
  this.dateReturned = new Date();
  
  const rentalDays = moment().diff(this.dateOut, 'days');
  this.rentalFee = rentalDays * this.movie.dailyRentalRate;
};

const Rental = mongoose.model('Rental', rentalSchema);

function validationRental(rental) {
   const schema = {
      customerId: Joi.objectId().required(),
      movieId: Joi.objectId().required(),
   };

   return Joi.validate(rental, schema);
}

exports.validationRental = validationRental;
exports.Rental = Rental;
