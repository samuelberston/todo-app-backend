const getUserLists = `SELECT * FROM todo.lists WHERE user_uuid = $1;`;

const getTodoList = `SELECT * from todo.lists WHERE list_uuid = $1`;

const postUserLists = `INSERT INTO todo.lists (list_uuid, list_name, user_uuid, todo_count)
                       VALUES ($1, $2, $3, 0);`

const putListsName = `UPDATE todo.lists SET todo.lists.list_name = $1
                     WHERE todo.lists.list_uuid = $2;`

const putListsTodoCount = `UPDATE todo.lists
                       SET todo.lists.todo_count = todo.lists.todo_count + 1
                       WHERE todo.lists.list_uuid = $1;`

const decListsTodoCount = `UPDATE todo.lists
                           SET todo.lists.todo_count = todo.lists.todo_count - 1
                           WHERE todo.lists.list_uuid = $1;`

const deleteLists = `DELETE FROM todo.lists WHERE todo.lists.list_uuid = $1;`

module.exports = {
  getUserLists,
  getTodoList,
  postUserLists,
  putListsName,
  putListsTodoCount,
  decListsTodoCount,
  deleteLists
}