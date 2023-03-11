const express = require('express');
const postgres = require('../psql.js');
const { body, validationResult } = require('express-validator');

const { getUser, postUser } = require('../queries/usersQueries.js');

const UsersRouterPsql = express.Router();

UsersRouterPsql.get('/users', (err, data) => {
  const user_id = req.auth.payload.sub;
  console.log('user_id', user_id);

  postgres.query(getUser, [user_id], (err, data) => {
    if (err) { throw err; }
    res.status(200).send([user_id]);
  });
});

UsersRouterPsql.post('/users', (err, data) => {
  const user_id = req.auth.payload.sub;
  console.log('user_id', user_id);

  postgres.query(postUser, [user_id], (err, data) => {
    if (err) { throw err; }
    res.status(201).send(data.rows);
  });
});

module.exports = UsersRouterPsql;