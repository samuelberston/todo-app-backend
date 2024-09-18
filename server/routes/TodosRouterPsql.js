const express = require('express');
const postgres = require('../psql.js');
const { body, query, validationResult } = require('express-validator');
const uuid = require('uuid');

const { getUserTodos, getUserTodosAndLists, getUserTodosAndListsByList, postTodo, putTodo, deleteTodo } = require('../queries/todosQueries.js');

const TodosRouterPsql = express.Router();

// receive all todos from the db
TodosRouterPsql.get(
  '/todos', 
  query('user_uuid').isUUID().withMessage('Invalid user_uuid'),  // Validate user_uuid as UUID
  query('list_uuid').optional().isUUID().withMessage('Invalid list_uuid'), // list_uuid is optional but must be a UUID if provided
  (req, res) => {
    // check for validation errors
    const result = validationResult(req);
    if (!result.isEmpty) {
      return res.status(400).json({ errors: result.array() });
    }

    const { user_uuid, list_uuid } = req.query;

    // check if user is authenticated
    if (!req.auth.payload.sub || !user_uuid) {
      res.status(401);
    }
    
    // Query the database based on whether list_uuid is present
    if (list_uuid) {
      postgres.query(getUserTodosAndListsByList, [user_uuid, list_uuid], (err, data) => {
        if (err) { 
          res.status(500).json({ error: 'Database error' });
        }
        res.status(200).json(data.rows);
      });
    } else {
      postgres.query(getUserTodosAndLists, [req.query.user_uuid], (err, data) => {
        if (err) { 
          res.status(500).json({ error: 'Database error' });
        }
        res.status(200).json(data.rows);
      });
    }
  }
);

// create a new todo item
TodosRouterPsql.post('/todos', (req, res) => {
  console.log('post todo');
  // insert new todo into db
  let { taskName, description, date_created, due, priority, user_uuid, list } = req.body;

  console.log("todo data: ", req.body);

  // update the validation section to run synchronously -- create another validation function
  if (description == undefined) { description = "" }
  if (date_created == undefined) { date_created = "" }
  if (due == undefined) {
    date_due = ""
  } else {
    console.log('validating due date');
    body(due).isDate()
  }
  if (priority == undefined) { priority = "" }

  console.log("todo query: ", `INSERT INTO todo.todos (todo_uuid, task, description, date_created, date_due, priority, user_uuid, list_uuid)
  VALUES ('todo_uuid', '${taskName}', "${description}", "${date_created}", "${due}", "${priority}", "${user_uuid}", ${list.list_uuid}) RETURNING todo_id`)

  // use the express validator
  postgres.query(postTodo, [uuid.v4(), taskName, description, date_created, due, priority, user_uuid, list.list_uuid],
    (err, data) => {
      if (err) { throw err; }
      const todoUUID = data.rows[0].todo_uuid;
      console.log('created new todo with uuid: ', todoUUID);
      res.status(201).send([todoUUID]);
    });
});

// update a todo item
TodosRouterPsql.put('/todos', (req, res) => {
  console.log('put todo');
  console.log("req.body: ", req.body);
  let { todo_id, taskName, description, date_created, due, priority, user_uuid, list } = req.body;

  if (description == undefined) { description = ""; }
  if (date_created == undefined) { date_created = ""; }
  if (due == undefined) { due = "; "}
  if (priority == undefined) { priority = ""; }
  
  console.log('update todo query: ', `UPDATE todo.todos
  SET task = '${taskName}', description = '${description}', date_created = '${date_created}', date_due= '${due}', priority = '${priority}', list_uuid = '${list.list_uuid}'
  WHERE todo_id = ${todo_id} AND user_id = ${user_uuid}`);

  console.log(uuid.stringify(uuid.parse(list.list_uuid)));
  console.log(list.list_uuid);

  postgres.query(putTodo, [taskName, description, date_created, due, priority, uuid.stringify(uuid.parse(list.list_uuid)), todo_id, user_uuid],
    (err, data) => {
      if (err) { throw err; }
      res.status(204).json({todo_id, user_uuid});
    });
});

// delete a todo item
TodosRouterPsql.delete('/todos', (req, res) => {
  const { todoId, user_uuid } = req.query;
  console.log('deleting todo with id: ', todoId, ' and user uuid: ', user_uuid);
  // remove from db
  postgres.query(deleteTodo, [todoId, user_uuid], (err, data) => {
    if (err) { throw err; }
    res.status(200).send(data);
  });
});

module.exports = TodosRouterPsql;