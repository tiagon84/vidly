const auth = require('../middleware/authentication');
const validate = require('../middleware/validate');
const express = require('express');
const router = express.Router();
const { Customer } = require('../models/customer');
const { validationCustomer } = require('../models/customer');

router.get('/', auth, async (req, res) => {
   const customer = await Customer.find().sort('name');
   res.send(customer);
});

router.get('/:id', auth, async (req, res) => {
   const customer = await Customer.findById(req.params.id);
   if (!customer) return res.status(404).send('Could not find customer');
   res.send(customer);
});

router.post('/', [auth, validate(validationCustomer)], async (req, res) => {
   const customer = new Customer({
      isGold: req.body.isGold,
      name: req.body.name,
      phone: req.body.phone,
   });

   await customer.save();
   res.send(customer);
});

router.put('/:id', [auth, validate(validationCustomer)], async (req, res) => {
   const customer = await Customer.findByIdAndUpdate(
      req.params.id,
      { isGold: req.body.isGold, name: req.body.name, phone: req.body.phone },
      { new: true }
   );
   if (!customer) return res.status(404).send('Could not find the genre');

   res.send(customer);
});

router.delete('/:id', auth, async (req, res) => {
   const customer = await Customer.findByIdAndRemove(req.params.id);
   if (!customer) return res.status(404).send('Could not find the genre');

   res.send(customer);
});

module.exports = router;
