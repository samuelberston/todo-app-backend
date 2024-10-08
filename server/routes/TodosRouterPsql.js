const express = require('express');
const postgres = require('../psql.js');
const { body, query, validationResult } = require('express-validator');
const uuid = require('uuid');

const { getUserTodos, getUserTodosAndLists, getUserTodosAndListsByList, postTodo, putTodo, deleteTodo } = require('../queries/todosQueries.js');

const TodosRouterPsql = express.Router();

// receive all todos from the db
TodosRouterPsql.get(
  '/todos', 
  [
    query('user_uuid').isUUID().withMessage('Invalid user_uuid'),  // Validate user_uuid as UUID
    query('list_uuid').optional().isUUID().withMessage('Invalid list_uuid') // list_uuid is optional but must be a UUID if provided
  ], 
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
TodosRouterPsql.post(
  '/todos',
  [
    // Validate and sanitize taskName
    body('taskName').trim().escape().notEmpty().withMessage('Task name is required'),
    // Sanitize and validate description (optional)
    body('description').optional().trim().escape().isString().withMessage('Description must be a string'),
    // Sanitize and validate date_created (optional)
    body('date_created').optional().trim().isISO8601().toDate().withMessage('Invalid creation date format'),
    // Sanitize and validate due (optional)
    body('due').optional().trim().isISO8601().toDate().withMessage('Invalid due date format'),
    // Sanitize and validate priority (optional)
    body('priority').optional().trim().escape().isString().withMessage('Priority must be a string'),
    // Validate and sanitize user_uuid as a valid UUID
    body('user_uuid').isUUID().withMessage('Invalid user UUID'),
    // Validate and sanitize list.list_uuid as a valid UUID
    body('list.list_uuid').isUUID().withMessage('Invalid list UUID')
  ],
  (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(400).json({ errors: result.array() });
    }

    // Destructure validated data from the request body
    let { taskName, description, date_created, due, priority, user_uuid, list } = req.body;

    // Fallbacks for undefined fields (if nececesary)
    if (description == undefined) { description = "" }
    if (date_created == undefined) { date_created = "" }
    if (due == undefined) { date_due = "" }
    if (priority == undefined) { priority = "" }

    console.log("todo query: ", `INSERT INTO todo.todos (todo_uuid, task, description, date_created, date_due, priority, user_uuid, list_uuid)
    VALUES ('todo_uuid', '${taskName}', "${description}", "${date_created}", "${due}", "${priority}", "${user_uuid}", ${list.list_uuid}) RETURNING todo_id`)

    // Insert the new todo into the database using parameterized query (prevents SQL injection)
    postgres.query(postTodo, [uuid.v4(), taskName, description, date_created, due, priority, user_uuid, list.list_uuid],
      (err, data) => {
        if (err) { 
          return res.status(500).json({ error: 'Database error' });
        }
        const todoUUID = data.rows[0].todo_uuid;
        console.log('created new todo with uuid: ', todoUUID);
        res.status(201).send([todoUUID]);
      }
    );
  }
);

// update a todo item
TodosRouterPsql.put(
  '/todos', 
  [
    // Validate and sanitize taskName
    body('taskName').trim().escape().notEmpty().withMessage('Task name is required'),
    // Sanitize and validate description (optional)
    body('description').optional().trim().escape().isString().withMessage('Description must be a string'),
    // Sanitize and validate date_created (optional)
    body('date_created').optional().trim().isISO8601().toDate().withMessage('Invalid creation date format'),
    // Sanitize and validate due (optional)
    body('due').optional().trim().isISO8601().toDate().withMessage('Invalid due date format'),
    // Sanitize and validate priority (optional)
    body('priority').optional().trim().escape().isString().withMessage('Priority must be a string'),
    // Validate and sanitize user_uuid as a valid UUID
    body('user_uuid').isUUID().withMessage('Invalid user UUID'),
    // Validate and sanitize list.list_uuid as a valid UUID
    body('list.list_uuid').isUUID().withMessage('Invalid list UUID')
  ],
  (req, res) => {
    // validate input body
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(400).json({ errors: result.array() });
    }

    // destructure sanitized data from the request body
    let { todo_id, taskName, description, date_created, due, priority, user_uuid, list } = req.body;

    // fallbacks for undefined fields (if necessary)
    if (description == undefined) { description = ""; }
    if (date_created == undefined) { date_created = ""; }
    if (due == undefined) { due = "; "}
    if (priority == undefined) { priority = ""; }
    
    console.log('update todo query: ', `UPDATE todo.todos
    SET task = '${taskName}', description = '${description}', date_created = '${date_created}', date_due= '${due}', priority = '${priority}', list_uuid = '${list.list_uuid}'
    WHERE todo_id = ${todo_id} AND user_id = ${user_uuid}`);

    postgres.query(
      putTodo, 
      [taskName, description, date_created, due, priority, uuid.stringify(uuid.parse(list.list_uuid)), todo_id, user_uuid],
      (err, data) => {
        if (err) {
          return res.send(500).json({ error: 'Database error' });
        }
        res.status(204).json({todo_id, user_uuid});
      }
    );
  }
);

// delete a todo item
TodosRouterPsql.delete(
  '/todos',
  [
    // validate and sanitize todoId
    query('todoId').trim().escape().notEmpty().withMessage('Invalid todoId'),
    // validate and sanitize user_uuid
    query('user_uuid').isUUID().withMessage('Invalid user_uuid')

  ], 
  (req, res) => {
    // validate query parameters
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(400).json({ errors: result.array() });
    }

    // destructure sanitized query parameters
    const { todoId, user_uuid } = req.query;
    console.log('deleting todo with id: ', todoId, ' and user uuid: ', user_uuid);
    
    // Delete todo from the database using pararmeterized statement (prevents SQL injection)
    postgres.query(
      deleteTodo, 
      [todoId, user_uuid], 
      (err, data) => {
        if (err) { 
          return res.send(500).json({ error: 'Database error' });
        }
        res.status(200).send(data);
      }
    );
  }
);

module.exports = TodosRouterPsql;