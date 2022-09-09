const express = require('express');
const router = express.Router();
const {Customer} = require('../models/customer');
const {validationCustomer} = require('../models/customer');


router.get('/', async (req, res) => {
  const customer = await Customer.find().sort('name');
  res.send(customer);
});

router.get('/:id', async (req, res) => {
  const customer = await Customer.findById(req.params.id);
  if (!customer) return res.status(404).send('Could not find customer');
  res.send(customer);
});

router.post('/', async (req, res) => {

  const { error } = validationCustomer(req.body);
  if (error) return res.status(400).send(error.details[0].message)

  const customer = new Customer({
    isGold: req.body.isGold,
    name: req.body.name,
    phone: req.body.phone
  });

  await customer.save();
  res.send(customer);
});

router.put('/:id', async (req, res) => {
  const { error } = validationCustomer(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const customer = await Customer.findByIdAndUpdate(req.params.id,
    { isGold: req.body.isGold, name: req.body.name, phone: req.body.phone },
    { new: true }
  );
  if (!customer) return res.status(404).send('Could not find the genre');

  res.send(customer);
});


router.delete('/:id', async (req, res) => {
  const customer = await Customer.findByIdAndRemove(req.params.id);
  if (!customer) return res.status(404).send('Could not find the genre');

  res.send(customer);
});

module.exports = router;