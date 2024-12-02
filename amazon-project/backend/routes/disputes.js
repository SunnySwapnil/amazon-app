const express = require('express');
const router = express.Router();
const pool = require('../config/db');

router.get('/', async (req, res) => {
  try {
    const disputesQuery = `
      SELECT d.*, 
        COALESCE(json_agg(DISTINCT o.*) FILTER (WHERE o.id IS NOT NULL), '[]') AS linked_orders,
        COALESCE(json_agg(DISTINCT r.*) FILTER (WHERE r.id IS NOT NULL), '[]') AS linked_returns
      FROM disputes d
      LEFT JOIN order_disputes od ON d.id = od.dispute_id
      LEFT JOIN orders o ON od.order_id = o.id
      LEFT JOIN return_disputes rd ON d.id = rd.dispute_id
      LEFT JOIN returns r ON rd.return_id = r.id
      GROUP BY d.id
    `;
    const disputes = await pool.query(disputesQuery);
    res.json(disputes.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch disputes.' });
  }
});

router.post('/', async (req, res) => {
  const { reason, status, linkedOrders, linkedReturns } = req.body;

  try {
    const disputeResult = await pool.query(
      'INSERT INTO disputes (reason, status) VALUES ($1, $2) RETURNING *',
      [reason, status]
    );

    const disputeId = disputeResult.rows[0].id;

    if (linkedOrders && linkedOrders.length) {
      const orderLinks = linkedOrders.map((orderId) =>
        pool.query(
          'INSERT INTO order_disputes (dispute_id, order_id) VALUES ($1, $2)',
          [disputeId, orderId]
        )
      );
      await Promise.all(orderLinks);
    }

    if (linkedReturns && linkedReturns.length) {
      const returnLinks = linkedReturns.map((returnId) =>
        pool.query(
          'INSERT INTO return_disputes (dispute_id, return_id) VALUES ($1, $2)',
          [disputeId, returnId]
        )
      );
      await Promise.all(returnLinks);
    }

    res.status(201).json(disputeResult.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create dispute.' });
  }
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const result = await pool.query(
      'UPDATE disputes SET status = $1 WHERE id = $2 RETURNING *',
      [status, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Dispute not found.' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update dispute.' });
  }
});

module.exports = router;
