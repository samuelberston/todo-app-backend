// get user
const getUser = `SELECT * from todo.users WHERE user_id = ($1)`;

// post user
const postUser = `INSERT INTO todo.users (user_uuid, user_id) VALUES ($1, $2)`;

module.exports = {
    getUser,
    postUser
}