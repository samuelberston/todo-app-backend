const ListsRouterPsql = require('express').Router();
const { v4: uuidv4 } = require('uuid');

const postgres = require('../psql.js');

const { getUserLists, getTodoList, postUserLists, putListsName, putListsTodoCount, decListsTodoCount, deleteLists } = require('../queries/listsQueries.js');

ListsRouterPsql.get('/lists', (req, res) => {
  console.log('get /lists', req.query);
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
  console.log('post /lists');
  const {list_name, user_uuid} = req.body;
  const list_uuid = uuidv4();
  postgres.query(postUserLists, [list_uuid, list_name, user_uuid], (err, data) => {
    if (err) { throw err; }
    res.json({'list_uuid': list_uuid});
    res.status(204);
  });
});

/*
* put /lists
* @param list_uuid
* @param list_name
*/
ListsRouterPsql.put('/lists', (req, res) => {
  console.log('put /lists with ', req.query);
  const {list_uuid, list_name, dec} = req.query;
  if (list_name) {
    postgres.query(putListsName, [list_name, list_uuid], (err, data) => {
      if (err) { throw err; }
      res.status(204);
    });
  } else if (dec) {
    postgres.query(decListsTodoCount, [list_uuid], (err, data) => {
      if (err) { throw err; }
      res.status(204);
    });
  } else {
      postgres.query(putListsTodoCount, [list_uuid], (err, data) => {
        if (err) { throw err; }
        res.status(204);
      });
  }
});

/*
* delete /lists
* @param list_uuid
*/
ListsRouterPsql.delete('/lists', (req, res) => {
  const { list_uuid } = req.query
  postgres.query(deleteLists, [list_uuid], (err, data) => {
    if (err) { throw err; }
    res.status(200);
    res.json('Deleted list with uuid ', list_uuid);
  });
});

module.exports = ListsRouterPsql;