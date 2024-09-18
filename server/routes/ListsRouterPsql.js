const ListsRouterPsql = require('express').Router();
const { v4: uuidv4 } = require('uuid');
const { query, validationResult } = require('express-validator');

const postgres = require('../psql.js');

const {
        getUserLists, getTodoList, postUserLists,
        putListsName, putListsTodoCount, decListsTodoCount,
        deleteLists, getListTodoCount
      } = require('../queries/listsQueries.js');

// GET /lists
ListsRouterPsql.get(
  '/lists',
  [
    // validate and sanitize user_uuid
    query('user_uuid').isUUID().withMessage('Invalid user_uuid'),
    // validate and sanitize list_uuid
    query('list_uuid').optional().isUUID().withMessage('Invalid list_uuid')
  ],
  (req, res) => {
    // validate query parameters
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(400).json({ errors: result.array() });
    }

    // destructure sanitized request query parameters
    const { user_uuid, list_uuid } = req.query;

    // if no list_uuid, get all lists for the user
    if (!list_uuid) {
      postgres.query(
        getUserLists, 
        [user_uuid], 
        (err, data) => {
          if (err) { 
            return res.status(500).send('Database error');
          }
          res.status(200).send(data.rows);
        }
      );
    } else {
      postgres.query(
        getUserLists, 
        [user_uuid], 
        (err, data) => {
          if (err) { 
            return res.status(500).send('Database error');
          }
          res.status(200).send(data.rows);
        }
      );
    }
  }
);

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
  const { list_uuid } = req.query;
  postgres.query(deleteLists, [list_uuid], (err, data) => {
    if (err) { throw err; }
    res.status(200);
    res.json('Deleted list with uuid ', list_uuid);
  });
});

/*
* get /lists-count - return # todos for list
* @param list_uuid
*/

ListsRouterPsql.get('/lists-count', (req, res) => {
  const { list_uuid } = req.query;
  postgres.query(getListTodoCount, [list_uuid], (err, data) => {
    if (err) { throw err; }
    res.status(200)
    res.json(data.rows[0]);
  });
});

module.exports = ListsRouterPsql;