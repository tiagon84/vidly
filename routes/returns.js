const express = require('express');
const moment = require('moment');
const Joi = require('joi');
const auth = require('../middleware/authentication');
const validate = require('../middleware/validate');
const { Rental } = require('../models/rental');
const { Movie } = require('../models/movie');
const router = express.Router();

router.post('/', [auth, validate(validationReturn)], async (req, res) => {
   const rental = await Rental.lookup(req.body.customerId, req.body.movieId);

   if (!rental)
      return res.status(404).send('rental for customer/movie not found');

   if (rental.dateReturned)
      return res.status(400).send('rental already processed');

   rental.return();
   await rental.save();

   await Movie.updateOne(
      { _id: rental.movie._id },
      { $inc: { numberInStock: 1 } }
   );

   return res.send(rental);
});

function validationReturn(req) {
   const schema = {
      customerId: Joi.objectId().required(),
      movieId: Joi.objectId().required(),
   };

   return Joi.validate(req, schema);
}

module.exports = router;
