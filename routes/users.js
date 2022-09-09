const _ = require('lodash');
const bcrypt = require('bcrypt');
const express = require('express');
const router = express.Router();
const { User, validationUser } = require('../models/user');

router.get('/', async (req, res) => {
  const users = await User.find().sort('name');
  res.send(users);
});

router.get('/:id', async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).send('Could not find user');
  res.send(user);
});

router.post('/', async (req, res) => {

  const { error } = validationUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send('Email already exists');

  user = new User(_.pick(req.body, ['name', 'email', 'password']));
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password,salt);
  await user.save();

  res.send(_.pick(user, ['_id', 'name', 'email']));
});

router.put('/:id', async (req, res) => {
  const { error } = validationUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const user = await User.findByIdAndUpdate(req.params.id, { name: req.body.name }, { new: true });
  if (!user) return res.status(404).send('Could not find the genre');

  res.send(user);
});

router.delete('/:id', async (req, res) => {
  const user = await User.findByIdAndRemove(req.params.id);
  if (!user) return res.status(404).send('Could not find the genre');

  res.send(user);
});


module.exports = router;