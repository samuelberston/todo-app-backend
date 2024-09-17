const { Client } = require('pg');
const AWS = require('aws-sdk');

const secretsManager = new AWS.SecretsManager({ region: 'us-east-1' });

// get DB credentials from AWS Secrets Manager
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

module.exports = postgres;
