const express = require('express');
const { body, validationResult } = require('express-validator');
const pool = require('../config/db');
const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const result = await pool.query('SELECT * FROM returns');
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
});

router.post(
  '/',
  [
    body('orderId').notEmpty().withMessage('Order ID is required'),
    body('reason').notEmpty().withMessage('Return reason is required'),
    body('tracking').notEmpty().withMessage('Return tracking is required'),
    body('originalOrder')
      .notEmpty()
      .withMessage('Original order ID is required'),
  ],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { orderId, reason, tracking, originalOrder } = req.body;
    try {
      const result = await pool.query(
        'INSERT INTO returns (order_id, reason, tracking, original_order) VALUES ($1, $2, $3, $4) RETURNING *',
        [orderId, reason, tracking, originalOrder]
      );
      res.status(201).json(result.rows[0]);
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
