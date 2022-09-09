const express = require('express');
const router = express.Router();

const { Customer } = require('../models/customer');
const { Movie } = require('../models/movie');
const { validationRental, Rental } = require('../models/rental');
const connString = 'mongodb://localhost/vidly';
const Fawn = require('fawn');
Fawn.init(connString);


router.get('/', async (req, res) => {
  const rentals = await Rental.find().sort('-dateOut');
  res.send(rentals);
});


router.post('/', async (req, res) => {

  const { error } = validationRental(req.body);
  if (error) return res.status(400).send(error.details[0].message)

  const customer = await Customer.findById(req.body.customerId);
  if (!customer) return res.status(404).send('Could not find customer');

  const movie = await Movie.findById(req.body.movieId);
  if (!movie) return res.status(404).send('Could not find movie');

  if (movie.numberInStock === 0) return res.status(400).send('Movie not in stock');

  let rental = new Rental({
    customer: {
      _id: customer._id,
      name: customer.name,
      phone: customer.phone
    },
    movie: {
      _id: movie._id,
      title: movie.title,
      dailyRentalRate: movie.dailyRentalRate
    },
  });

  try {

   await new Fawn.Task()
      .save('rentals', rental)
      .update('movies', { _id: movie._id }, { $inc: { numberInStock: -1 } })
      .run();

    res.send(rental);
  }
  catch (error) {
    console.log(error);
    res.status(500).send('Something went wrong');
  }

});


module.exports = router;