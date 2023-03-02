const cors = require("cors");
const path = require('path');
const dotenv = require('dotenv').config()
const express = require('express');

const {
  validateAccessToken,
} = require("./middleware/auth0.middleware.js");

const TodosRouterPsql = require('./routes/TodosRouterPsql.js');
const TagsRouterPsql = require('./routes/TagsRouterPsql.js');


const PORT = parseInt(process.env.PORT, 10);
const CLIENT_ORIGIN_URL = process.env.CLIENT_ORIGIN_URL;

const app = express();

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

app.listen(PORT, () => {
  console.log(`Listening at port ${PORT}`);
});