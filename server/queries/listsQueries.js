const getUserLists = `SELECT * FROM todo.lists WHERE user_uuid = $1;`;

const postUserLists = `INSERT INTO todo.lists (list_uuid, name, user_uuid) VALUES ($1, $2, $3);`

module.exports = {
  getUserLists,
  postUserLists
}