const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const ordersRoutes = require('./routes/orders');
const returnsRoutes = require('./routes/returns');
const disputesRoutes = require('./routes/disputes');
const errorHandler = require('./middleware/errorHandler');
const pool = require('./config/db');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

pool.connect((err) => {
  if (err) {
    console.error('Failed to connect to PostgreSQL:', err.message);
  } else {
    console.log('Connected to PostgreSQL database.');
  }
});

app.use('/api/orders', ordersRoutes);
app.use('/api/returns', returnsRoutes);
app.use('/api/disputes', disputesRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Amazon Management API.' });
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
