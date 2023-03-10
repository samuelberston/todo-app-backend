const express = require('express');
const postgres = require('../psql.js');
const { body, validationResult } = require('express-validator');

const { getTodos, getUserTodos, postTodo, putTodo, deleteTodo } = require('../queries/todosQueries.js');

const TodosRouterPsql = express.Router();

// receive all todos from the db
TodosRouterPsql.get('/todos', (req, res) => {
  console.log('user_id', req.auth.payload.sub);
  if (req.auth.payload.sub !== undefined) {
    postgres.query(getUserTodos, [req.auth.payload.sub], (err, data) => {
        if (err) { throw err; }
        res.status(200).send(data.rows);
    });
  } else {
    postgres.query(getTodos, (err, data) => {
      if (err) { throw err; }
      res.status(200).send(data.rows);
    });
  }
});

// create a new todo item
TodosRouterPsql.post('/todos', (req, res) => {
  console.log('post todo');
  // insert new todo into db
  let { taskName, description, date_created, due, priority, user_id } = req.body;

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

  console.log("todo query: ", `INSERT INTO todo.todos (task, description, date_created, date_due, priority, user_id)
  VALUES ('${taskName}', "${description}", "${date_created}", "${due}", "${priority}", "${user_id}") RETURNING todo_id`)

  // use the express validator
  postgres.query(postTodo, [taskName, description, date_created, due, priority, user_id],
    (err, data) => {
      if (err) { throw err; }
      const todoId = data.rows[0].todo_id;
      console.log('created new todo with id: ', todoId);
      res.status(201).send([todoId]);
    });
});

// update a todo item
TodosRouterPsql.put('/todos', (req, res) => {
  console.log('put todo');
  console.log("req.body: ", req.body);
  let { todo_id, taskName, description, date_created, due, priority } = req.body;

  if (description == undefined) { description = ""}
  if (date_created == undefined) { date_created = ""}
  if (due == undefined) { due = ""}
  if (priority == undefined) { priority = ""}
  
  console.log('update todo query: ', `UPDATE todo.todos
  SET task = '${taskName}', description = '${description}', date_created = '${date_created}', date_due= '${due}', priority = '${priority}'
  WHERE todo_id = ${todo_id}`);

  postgres.query(putTodo, [taskName, description, date_created, due, priority, todo_id],
    (err, data) => {
      if (err) { throw err; }
      res.status(204).json(todo_id);
    });
});

// delete a todo item
TodosRouterPsql.delete('/todos', (req, res) => {
  const todoId = req.query.todoId;
  // remove from db
  postgres.query(deleteTodo, [todoId], (err, data) => {
    if (err) { throw err; }
    res.status(200).send(data);
  });
});

module.exports = TodosRouterPsql;
