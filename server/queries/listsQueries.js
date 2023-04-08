const getUserLists = `SELECT * FROM todo.lists WHERE user_uuid = $1;`;

const getTodoList = `SELECT * from todo.lists WHERE list_uuid = $1`;

const postUserLists = `INSERT INTO todo.lists (list_uuid, name, user_uuid) VALUES ($1, $2, $3);`

module.exports = {
  getUserLists,
  getTodoList,
  postUserLists
}