const { Client } = require('pg');

// Local host connection
const postgres = new Client({
  host: '127.0.0.1',
  port: 5432,
  user: 'samuelberston',
  database: 'todo'
})

postgres.connect((err) => {
  if (err) { throw err; }
  console.log(`Database connected at port 5432`);
})

module.exports = postgres;
