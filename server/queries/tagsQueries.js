// get all /tags
const getAllTags = 'SELECT * from todo.tags'

// get /tags query with todoId query param
const getTagsForTodoId = `SELECT * FROM todo.tags
    JOIN todo.todos_tags ON todo.tags.tag_id = todo.todos_tags.tag_id
    WHERE todo.todos_tags.todo_id = $1
`

// post /tags query
const postTag = `INSERT INTO todo.tags (tag) VALUES ($1) RETURNING tag_id;`

// post todos-tags query
const postTodosTags = `INSERT INTO todo.todos_tags (todo_id, tag_id) VALUES ($1, $2)`

// delete /todos-tags query
const deleteTodosTags = `DELETE FROM todo.todos_tags WHERE todo_id = $1 AND tag_id = $2`

// delete all todos_tags
const deleteAllTodosTags = `DELETE FROM todo.todos_tags WHERE todo_id = $1;`

module.exports = {
    getAllTags,
    getTagsForTodoId,
    postTag,
    postTodosTags,
    deleteTodosTags,
    deleteAllTodosTags
}
