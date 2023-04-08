const ListsRouterPsql = require('express').Router();

const postgres = require('../psql.js');

const { getUserLists } = require('../queries/listsQueries.js');

ListsRouterPsql.get('/lists', (req, res) => {
  const user_uuid = req.query.user_uuid;
  postgres.query(getUserLists, [user_uuid], (err, data) => {
    if (err) { throw err; }
    res.status(200).send(data.rows);
  });
});

module.exports = ListsRouterPsql;