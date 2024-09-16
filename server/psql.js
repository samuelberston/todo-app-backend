const { Client } = require('pg')

const port = 5432;

// for connection to docker postgresql (todo-db)
const user = 'postgres';
//const host = 'host.docker.internal'; // for running todo-app with containerized db
const host = '0.0.0.0'; // for running todo-app locally
const database = 'todo';

const AWS = require('aws-sdk');
const secretsManager = new AWS.SecretsManager({ region: 'us-east-1' }); // Adjust the region if necessary

// get DB credentials from AWS Secrests Manager
async function getDatabaseCredentials() {
  try {
    const data = await secretsManager.getSecretValue({ SecretId: 'rds-database-password' }).promise();

    if (data.SecretString) {
      const credentials = JSON.parse(data.SecretString);
      return credentials;
    } else {
      throw new Error('Secret not found');
    }
  } catch (err) {
    console.error('Error retrieving secret:', err);
    throw err;
  }
}

async function connectToDatabase() {
  const credentials = await getDatabaseCredentials();

  const client = new Client({
    user: credentials.username,
    host: 'threat-postgres-rds.cluster-ro-cwhep9aqborz.us-east-1.rds.amazonaws.com',
    database: 'todo',
    password: credentials.password,
    port: 5432,
  });

  await client.connect();
  console.log('Connected to PostgreSQL database');
}

connectToDatabase();


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
