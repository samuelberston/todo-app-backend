const cors = require("cors");
const path = require('path');
const dotenv = require('dotenv').config()
const express = require('express');
const helmet = require('helmet');

const {
  validateAccessToken,
} = require("./middleware/auth0.middleware.js");

const TodosRouterPsql = require('./routes/TodosRouterPsql.js');
const TagsRouterPsql = require('./routes/TagsRouterPsql.js');
const UsersRouterPsql = require('./routes/UsersRouterPsql');
const ListsRouterPsql = require('./routes/ListsRouterPsql');
const SubtasksRouterPsql = require('./routes/SubtasksRouterPsql');

const PORT = parseInt(process.env.PORT, 10);
const CLIENT_ORIGIN_URL = process.env.CLIENT_ORIGIN_URL;

const app = express();

// Use Helmet to secure app by setting various HTTP headers https://www.npmjs.com/package/helmet
app.use(helmet());

app.use(express.json());

app.use(
  cors({
    origin: CLIENT_ORIGIN_URL,
    methods: ["GET, PUT, POST, DELETE"],
    allowedHeaders: ["Authorization, Origin, X-Requested-With, Content-Type, Accept, data, body"],
    maxAge: 86400,
  })
);

app.use('/', validateAccessToken, TodosRouterPsql);
app.use('/', validateAccessToken, TagsRouterPsql);
app.use('/', validateAccessToken, UsersRouterPsql);
app.use('/', validateAccessToken, ListsRouterPsql);
app.use('/', validateAccessToken, SubtasksRouterPsql);

app.listen(PORT, () => {
  console.log(`Listening at port ${PORT}`);
});