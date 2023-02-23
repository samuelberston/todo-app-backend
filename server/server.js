const path = require('path');
const dotenv = require('dotenv').config()

const express = require('express');

const TodosRouterPsql = require('./routes/TodosRouterPsql.js');
const TagsRouterPsql = require('./routes/TagsRouterPsql.js')

const app = express();
const port = 3000;

app.use(express.json());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://127.0.0.1:8080"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// refactor this to run the routes in a separate server, so I can isolate the UI
// then, connect to that server ... and use that as middleware
app.use('/', TodosRouterPsql);
app.use('/', TagsRouterPsql);

app.listen(port, () => {
  console.log(`Listening at port ${port}`);
});
