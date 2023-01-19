// get all todos
const getTodos = 'SELECT * FROM todo.todos ORDER BY todo_id;';

// post todo
const postTodo = `INSERT INTO todo.todos (task, description, date_created, date_due, priority)
                  VALUES ($1, $2, $3, $4, $5) RETURNING todo_id;`

// put todo
const putTodo = `UPDATE todo.todos
                 SET task = $1, description = $2, date_created = $3, date_due= $4, priority = $5
                    WHERE todo_id = $6`

// delete todo
const deleteTodo = `DELETE FROM todo.todos WHERE todo_id = $1;`

module.exports = {
    getTodos,
    postTodo,
    putTodo,
    deleteTodo
}
