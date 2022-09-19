const auth = require('../middleware/authentication');
const validate = require('../middleware/validate');
const validateObjectId = require('../middleware/validateObjectId');
const express = require('express');
const router = express.Router();
const { Genre } = require('../models/genre');
const { validationGenre } = require('../models/genre');
const admin = require('../middleware/admin');

router.get('/', async (req, res) => {
   const genres = await Genre.find().sort('name');
   res.send(genres);
});

router.get('/:id', validateObjectId, async (req, res) => {
   const genre = await Genre.findById(req.params.id);
   if (!genre) return res.status(404).send('Could not find the genre');
   res.send(genre);
});

router.post('/', [auth, validate(validationGenre)], async (req, res) => {
   const genre = new Genre({
      name: req.body.name,
   });

   await genre.save();
   res.send(genre);
});

router.put('/:id', [auth, validate(validationGenre)], async (req, res) => {
   const genre = await Genre.findByIdAndUpdate(
      req.params.id,
      { name: req.body.name },
      { new: true }
   );
   if (!genre) return res.status(404).send('Could not find the genre');

   res.send(genre);
});

router.delete('/:id', [auth, admin], async (req, res) => {
   const genre = await Genre.findByIdAndRemove(req.params.id);
   if (!genre) return res.status(404).send('Could not find the genre');

   res.send(genre);
});

module.exports = router;
