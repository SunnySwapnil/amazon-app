const express = require('express');
const { body, validationResult } = require('express-validator');
const pool = require('../config/db');
const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const result = await pool.query('SELECT * FROM orders');
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
});

router.post(
  '/',
  [
    body('orderId').notEmpty().withMessage('Order ID is required'),
    body('item').notEmpty().withMessage('Item is required'),
    body('customer').notEmpty().withMessage('Customer details are required'),
  ],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { orderId, item, customer } = req.body;
    try {
      const result = await pool.query(
        'INSERT INTO orders (order_id, item, customer) VALUES ($1, $2, $3) RETURNING *',
        [orderId, item, customer]
      );
      res.status(201).json(result.rows[0]);
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
