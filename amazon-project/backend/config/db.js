const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'amazon-db',
  password: 'Almighty',
  port: 5432,
});

module.exports = pool;
