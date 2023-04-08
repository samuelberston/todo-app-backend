const getUserLists = `SELECT * FROM todo.lists WHERE user_uuid = $1;`;

module.exports = {
  getUserLists
}