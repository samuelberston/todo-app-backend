const express = require('express');
const { v4: uuidv4 } = require('uuid');

const postgres = require('../psql.js');
const { body, validationResult } = require('express-validator');

const { getUser, postUser } = require('../queries/usersQueries.js');

const UsersRouterPsql = express.Router();

UsersRouterPsql.get('/users', (req, res) => {
  const user_id = req.auth.payload.sub;

  postgres.query(getUser, [user_id], (err, data) => {
    if (err) { 
      console.log(err);
      return res.status(500).send('Internal Server Error');
    }
    res.status(200).send(data.rows[0]);
  });
});

UsersRouterPsql.post('/users', (req, res) => {
  const user_uuid = uuidv4()
  const user_id = req.auth.payload.sub;
  const user_email = req.body.email;
  postgres.query(postUser, [user_uuid, user_id, user_email], (err, data) => {
    if (err) { throw err; }
    res.status(201).send([user_id]);
  });
});

module.exports = UsersRouterPsql;