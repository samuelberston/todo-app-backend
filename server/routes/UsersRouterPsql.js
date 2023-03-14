const express = require('express');
const { v4: uuidv4 } = require('uuid');

const postgres = require('../psql.js');
const { body, validationResult } = require('express-validator');

const { getUser, postUser } = require('../queries/usersQueries.js');

const UsersRouterPsql = express.Router();

UsersRouterPsql.get('/users', (req, res) => {
  const user_id = req.auth.payload.sub;
  console.log('user_id', user_id);

  postgres.query(getUser, [user_id], (err, data) => {
    if (err) { throw err; }
    console.log('user data:  ', data.rows);
    res.status(200).send(data.rows[0]);
  });
});

UsersRouterPsql.post('/users', (req, res) => {
  const user_id = req.auth.payload.sub;
  console.log('user_id', user_id);

  postgres.query(postUser, [uuidv4(), user_id], (err, data) => {
    if (err) { throw err; }
    res.status(201).send([user_id]);
  });
});

module.exports = UsersRouterPsql;