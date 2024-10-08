const express = require('express');
const { body, query, validationResult } = require('express-validator');
const postgres = require('../psql.js');

const { getAllTags, getTagsForTodoId, postTag, postTodosTags, deleteTodosTags, deleteAllTodosTags } = require('../queries/tagsQueries.js');

const TagsRouterPsql = express.Router();

// GET /tags - optional todoId query param to get tags for a todo item
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

// POST /tags
TagsRouterPsql.post(
    '/tags',
    // validate and sanitize tagName
    body("tagName").notEmpty().trim().escape().withMessage('Invalid tagName'), 
    (req, res) => {
        // validate tagName
        const result = validationResult(req);
        if (!result.isEmpty()) {
            return res.status(400).json({ error: result });
        }

        // destructure sanitized tagName from the request body
        let { tagName } = req.body;
        // Insert tag into the database using parameterized statement (prevents SQL injection) 
        postgres.query(
            postTag, 
            [tagName],
            (err, data) => {
                // handle any errors
                if (err) {
                    return res.status(500).send('Database error');
                }
                const tagId = data.rows[0].tag_id;
                console.log('Created a new tag with id: ', tagId);
                res.status(201).json({tagId: tagId});
            }
        );
    }
);

// add a tag to a todo item
TagsRouterPsql.post(
    '/todos-tags',
    [
        // validate and sanitize todoId
        body('todoId').notEmpty().trim().escape().withMessage('Invalid todoId'),
        // validate and sanitize  tagId
        body('tagId').notEmpty().trim().escape().withMessage('Invalid tagId'),
    ],
    (req, res) => {
        // destructure the sanitized body fields
        const { todoId, tagId } = req.body;
        console.log(`Adding tag with id: ${tagId} to todo with id: ${todoId}`);
        // Insert the relation into the todos_tags table
        postgres.query(
            postTodosTags, 
            [Number(todoId), Number(tagId)], 
            (err, data) => {
            if (err) {
                return res.status(500).send('Database error');
            }
            return res.status(201).send({tagId, todoId});
        });
    }
);

// DELETE /todos-tags
TagsRouterPsql.delete(
    '/todos-tags', 
    [
        // validate and sanitize todoId
        body('todoId').notEmpty().trim().escape().withMessage('Invalid todoId'),
        // validate and sanitize optional tagId
        body('tagId').optional().trim().escape().withMessage('Invalid tagId'),
    ],
    (req, res) => {
        // destructure sanitized body fields
        const { todoId, tagId } = req.body;
        // tagId undefined means delete all tags from todo
        if (tagId == undefined) {
            const { todoId } = req.body
            console.log('Deleting tags for todo with id: ', todoId);
            postgres.query(
                deleteAllTodosTags, 
                [Number(todoId)], 
                (err, data) => {
                    if (err) {
                        return res.status(500).send('Database error');
                    }
                    return res.status(200).send(`Deleted tags for todo with id: ${todoId}`)
                }
            );
        } else {
            console.log('Deleting tag with id: ', tagId, ' from todo with id: ', todoId);
            postgres.query(
                deleteTodosTags, 
                [Number(todoId), Number(tagId)], 
                (err, data) => {
                    if (err) {
                        return res.status(500).send('Database error');
                    }
                    return res.status(200).json({todoId, tagId});
                }
            );
        }
    }
);

module.exports = TagsRouterPsql;