const getSubtasks = `SELECT * FROM todo.subtasks WHERE todo_uuid = $1;`;

const postSubtask = `INSERT INTO todo.subtasks (subtask_uuid, task, description, date_created, date_due, priority, user_uuid, todo_uuid)
                     VALUES ($1, $2, $3, $4, $5, $6, $7, $8);`;

const putSubtask = `UPDATE todo.subtasks
                    SET task = $1, description = $2, date_due = $3, priority = $4
                    WHERE subtask_uuid = $5;`;

const deleteSubtask = `DELETE FROM todo.subtasks WHERE subtask_uuid = $1;`;

module.exports = {
    getSubtasks,
    postSubtask,
    putSubtask,
    deleteSubtask
};