const ListsRouterPsql = require('express').Router();
const { v4: uuidv4 } = require('uuid');

const postgres = require('../psql.js');

const { getUserLists, getTodoList, postUserLists } = require('../queries/listsQueries.js');

ListsRouterPsql.get('/lists', (req, res) => {
  const { user_uuid, list_uuid } = req.query;
  if (list_uuid) {
    postgres.query(getTodoList, [todo_uuid], (err, data) => {
      if (err) { throw err; }
      res.status(200).send(data);
    });
  } else if (user_uuid) {
    postgres.query(getUserLists, [user_uuid], (err, data) => {
      if (err) { throw err; }
      res.status(200).send(data.rows);
    });
  }
});

ListsRouterPsql.post('/lists', (req, res) => {
  const {name, user_uuid} = req.body;
  const list_uuid = uuidv4();
  postgres.query(postUserLists, [list_uuid, name, user_uuid], (err, data) => {
    if (err) { throw err; }
    res.status(204).send([list_uuid]);
  });
});

module.exports = ListsRouterPsql;