const express = require('express');
const postgres = require('../psql.js');
const uuid = require('uuid');

// SQL queries
const { getUserTodos, getUserTodosAndLists, getUserTodosAndListsByList, postTodo, putTodo, deleteTodo } = require('../queries/todosQueries.js');

// vault services
const { vault_encrypt_all, vault_decrypt_all } = require('../../vault/services.js') ;

const TodosRouterPsql = express.Router();

// receive all todos from the db
TodosRouterPsql.get('/todos', (req, res) => {
  const { user_uuid, list_uuid } = req.query;
  console.log('req params: ', req.query);
  if (!req.auth.payload.sub || !user_uuid) {
    res.status(401);
  } else if (list_uuid) {
    postgres.query(getUserTodosAndListsByList, [user_uuid, list_uuid], (err, data) => {
      if (err) { throw err; }
      res.status(200).send(data.rows);
    });
  } else {
    postgres.query(getUserTodosAndLists, [req.query.user_uuid], (err, data) => {
        if (err) { throw err; }
        console.log(data.rows);
        vault_decrypt_all(data.rows)
          .then(res => console.log(res))
        res.status(200).send(data.rows);
    });
  }
});

// create a new todo item
TodosRouterPsql.post('/todos', (req, res) => {
  let { taskName, description, date_created, due, priority, user_uuid, list } = req.body;

  // update the validation section to run synchronously -- create another validation function
  if (description == undefined) { description = "" }
  if (date_created == undefined) { date_created = "" }
  if (due == undefined) {
    date_due = ""
  }
//  else {
//     use express-validator library
//    body(due).isDate()
//  }
  if (priority == undefined) { priority = "" }
  if (list == undefined) { list = "" }

  const arguments = [uuid.v4(), taskName, description, date_created, due, priority, user_uuid, list.list_uuid];
  vault_encrypt_all(arguments)
    .then((encryptedValues) =>
      postgres.query(postTodo, ...encryptedValues,
        (err, data) => {
          if (err) { throw err; }
          const todoUUID = data.rows[0].todo_uuid;
          console.log('created new todo with uuid: ', todoUUID);
          res.status(201).send([todoUUID]);
        })
    )

  // use the express validator
//  postgres.query(postTodo, [encryptedValues],
//    (err, data) => {
//      if (err) { throw err; }
//      const todoUUID = data.rows[0].todo_uuid;
//      console.log('created new todo with uuid: ', todoUUID);
//      res.status(201).send([todoUUID]);
//    });
});

// update a todo item
TodosRouterPsql.put('/todos', (req, res) => {
  console.log('put todo');
  console.log("req.body: ", req.body);
  let { todo_id, taskName, description, date_created, due, priority, user_uuid, list } = req.body;

  if (description == undefined) { description = ""; }
  if (date_created == undefined) { date_created = ""; }
  if (due == undefined) { due = ""; }
  if (priority == undefined) { priority = ""; }

  const arguments = []

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