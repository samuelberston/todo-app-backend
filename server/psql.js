const { Client } = require('pg')

const port = 5432;

// for connection to docker postgresql (todo-db)
const user = 'postgres';
//const user = 'sberston';
const password = 'docker';
//const host = 'host.docker.internal'; // for running todo-app with containerized db
const host = '0.0.0.0'; // for running todo-app locally
const database = 'todo';

const postgres = new Client({
    host,
    port,
    password,
    user,
    database
});

postgres.connect((err) => {
    if (err) { throw err; }
    console.log(`database connected at ${port}`);
});

module.exports = postgres;
