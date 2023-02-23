const cors = require("cors");
const path = require('path');
const dotenv = require('dotenv').config()
const express = require('express');

const TodosRouterPsql = require('./routes/TodosRouterPsql.js');
const TagsRouterPsql = require('./routes/TagsRouterPsql.js')

const PORT = parseInt(process.env.PORT, 10);
const CLIENT_ORIGIN_URL = process.env.CLIENT_ORIGIN_URL;

const app = express();

app.use(express.json());

app.use(
  cors({
    origin: CLIENT_ORIGIN_URL,
    methods: ["GET, PUT, POST, DELETE"],
    allowedHeaders: ["Authorization, Origin, X-Requested-With, Content-Type, Accept"],
    maxAge: 86400,
  })
);

// refactor this to run the routes in a separate server, so I can isolate the UI
// then, connect to that server ... and use that as middleware
app.use('/', TodosRouterPsql);
app.use('/', TagsRouterPsql);

app.listen(PORT, () => {
  console.log(`Listening at port ${PORT}`);
});
