// get all todos
//const getTodos = 'SELECT * FROM todo.todos ORDER BY todo_id;';

const getUserTodos = `SELECT * FROM todo.todos WHERE user_uuid = $1 ORDER BY todo_id;`

const getUserTodosAndLists = `SELECT *
                              FROM todo.todos
                              INNER JOIN todo.lists
                              ON todo.todos.list_uuid = todo.lists.list_uuid
                              WHERE todo.todos.user_uuid = $1
                              ORDER BY todo_id;`

const getUserTodosAndListsByList = `SELECT *
                                    FROM todo.todos
                                    INNER JOIN todo.lists
                                    ON todo.todos.list_uuid = todo.lists.list_uuid
                                    WHERE todo.todos.user_uuid = $1
                                    AND todo.todos.list_uuid = $2
                                    ORDER BY todo_id;`

// post todo
const postTodo = `INSERT INTO todo.todos (task, description, date_created, date_due, priority, user_uuid, list_uuid)
                  VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING todo_id;`

// put todo
const putTodo = `UPDATE todo.todos
                 SET task = $1, description = $2, date_created = $3, date_due= $4, priority = $5, list_uuid = $6::VARCHAR::UUID
                    WHERE todo_id = $7 AND user_uuid= $8;`

// delete todo
const deleteTodo = `DELETE FROM todo.todos WHERE todo_id = $1 AND user_uuid = $2;`

module.exports = {
//    getTodos,
    getUserTodos,
    getUserTodosAndLists,
    getUserTodosAndListsByList,
    postTodo,
    putTodo,
    deleteTodo
}
