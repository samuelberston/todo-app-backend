const express = require('express');
const uuid = require('uuid');
const postgres = require('../psql.js');
const { getSubtasks, postSubtasks, putSubtasks, deleteSubtasks } = '../queries/subtasks.queries.js';

const SubtasksRouterPsql = express.Router();

/* get /subtasks
*  @param todo_uuid
*/
SubtasksRouterPsql.get('/subtasks', (req, res) => {
  const { todo_uuid } req.query;
  postgres.query(getSubtasks, [todo_uuid], (err, data) => {
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

export default SubtasksRouterPsql;