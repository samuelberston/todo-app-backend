const express = require('express');
const { body, query, validationResult } = require('express-validator');
const postgres = require('../psql.js');

const { getAllTags, getTagsForTodoId, postTag, postTodosTags, deleteTodosTags, deleteAllTodosTags } = require('../queries/tagsQueries.js');

const TagsRouterPsql = express.Router();

// get all tags - optional todoId query param to get tags for a todo item
TagsRouterPsql.get(
    '/tags',
    // validate and sanitize optional todoId
    query('todoId').optional().trim().escape().notEmpty().withMessage('Invalid todoId'), 
    (req, res) => {
        // validate todoId
        const result = validationResult(req);
        if (!result.isEmpty()) {
            return res.status(400).json({ error: result });
        }

        // destructure sanitized todoId
        const { todoId } = req.query;
        if (typeof todoId !== "undefined" && todoId != null) {
            // query the db for all the tags for a specific todo
            postgres.query(
                getTagsForTodoId, 
                [todoId],
                (err, data) => {
                    if (err) { 
                        return res.status(500).send('Database error');
                    }
                    res.status(200).send(data.rows);
                });
        } else {
            // query the db for all the tags
            postgres.query(
                getAllTags, 
                (err, data) => {
                    if (err) { 
                        return res.status(500).send('Database error');
                    }                    
                    // send data to the client
                    res.status(200).send(data.rows);
            });
        }
    }
);

// create a new tag
TagsRouterPsql.post('/tags', (req, res) => {
    console.log('post /tags');
    // get the tag name from the req body
    let { tagName } = req.body;
    // add it to the tags table 
    postgres.query(postTag, [tagName],
    (err, data) => {
        // handle any errors
        if (err) {throw err;}
        const tagId = data.rows[0].tag_id;
        console.log('Created a new tag with id: ', tagId);
        // send 201 response code
        res.status(201).json({tagId: tagId});
    });
});

// add a tag to a todo item
TagsRouterPsql.post('/todos-tags', (req, res) => {
    console.log('post /todos-tags');
    console.log('req.body: ', req.body);
    const { todoId, tagId } = req.body;
    console.log(`Adding tag with id: ${tagId} to todo with id: ${todoId}`);
    // add it to the todos_tags table
    postgres.query(postTodosTags, [Number(todoId), Number(tagId)], (err, data) => {
        if (err) {throw err;}
        res.status(201).send({tagId, todoId});
    });
});

TagsRouterPsql.delete('/todos-tags', (req, res) => {
    res.status(200);
    console.log('deleting /todos-tags');
    console.log('req.body: ', req.body);
    const { todoId, tagId } = req.body;
    if (tagId == undefined) {
        const { todoId } = req.body
        console.log('Deleting tags for todo with id: ', todoId);
        postgres.query(deleteAllTodosTags, [Number(todoId)], (err, data) => {
            if (err) {res.status(500); throw err;}
            res.status(200).send(`Deleted tags for todo with id: ${todoId}`)
        });
    } else {
       console.log('Deleting tag with id: ', tagId, ' from todo with id: ', todoId);
       postgres.query(deleteTodosTags, [Number(todoId), Number(tagId)], (err, data) => {
          if (err) {res.status(500); throw err;}
          res.status(200).json({todoId, tagId});
       });
    }
});

module.exports = TagsRouterPsql;