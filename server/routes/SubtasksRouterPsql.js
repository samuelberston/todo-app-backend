const express = require('express');
const uuid = require('uuid');
const postgres = require('../psql.js');

const { postSubtasks, putSubtasks, deleteSubtasks } = require('../queries/subtasksQueries.js');

const SubtasksRouterPsql = express.Router();

// why can't i get this from the file????
const getSubtasks = `SELECT * FROM todo.subtasks WHERE todo_uuid = $1 AND user_uuid = $2;`;

/* get /subtasks
*  @param todo_uuid
*/
SubtasksRouterPsql.get('/subtasks', (req, res) => {
  console.log('get /subtasks', req.query);
  const { todo_uuid, user_uuid } = req.query;
  console.log('getSubtasks: ', postSubtasks, putSubtasks, deleteSubtasks);
  postgres.query(getSubtasks, [todo_uuid, user_uuid], (err, data) => {
    if (err) { throw err; }
    if (data) {
      res.send(data.rows);
      res.status(200);
    }
  });
});

// post /subtasks
SubtasksRouterPsql.post('/subtasks', (req, res) => {
  const subtask_uuid = uuid.v4();
  const { task, description, date_created, date_due, priority, user_uuid, todo_uuid } = req.body;
  postgres.query(postSubtasks, [subtask_uuid, task, description, date_created, date_due, priority, user_uuid, todo_uuid],
    (err, data) => {
      if (err) { throw err; }
      if (data) {
        res.send(subtask_uuid);
        res.status(204);
      }
  });
});

module.exports = SubtasksRouterPsql;