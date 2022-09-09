const express = require('express');
const router = express.Router();

const { genreSchema } = require('../models/genre');
const { Genre } = require('../models/genre');
const { Movie } = require('../models/movie');
const { validationMovie } = require('../models/movie');


router.get('/', async (req, res) => {
  const movie = await Movie.find().sort('title');
  res.send(movie);
});

router.get('/:id', async (req, res) => {
  const movie = await Movie.findById(req.params.id);
  if (!movie) return res.status(404).send('Could not find movie');
  res.send(movie);
});

router.post('/', async (req, res) => {

  const { error } = validationMovie(req.body);
  if (error) return res.status(400).send(error.details[0].message)

  const genre = await Genre.findById(req.body.genreId);
  if (!genre) return res.status(404).send('Could not find the genre');

  const movie = new Movie({
    title: req.body.title,
    genre: { 
      _id: genre._id, 
      name: genre.name 
    },
    numberInStock: req.body.numberInStock,
    dailyRentalRate: req.body.dailyRentalRate
  });

  await movie.save();
  res.send(movie);
});

router.put('/:id', async (req, res) => {
  const { error } = validationMovie(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const movie = await Movie.findByIdAndUpdate(req.params.id,
    { isGold: req.body.isGold, name: req.body.name, phone: req.body.phone },
    { new: true }
  );
  if (!movie) return res.status(404).send('Could not find the movie');

  res.send(movie);
});


router.delete('/:id', async (req, res) => {
  const movie = await Movie.findByIdAndRemove(req.params.id);
  if (!movie) return res.status(404).send('Could not find the movie');

  res.send(movie);
});


module.exports = router;