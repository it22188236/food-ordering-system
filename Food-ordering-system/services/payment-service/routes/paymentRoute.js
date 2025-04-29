const express = require('express');
const router = express.Router();

const { existPayment, ipn} = require('../controllers/paymentController');

router.post('/ipn',ipn);

module.exports = router;
  