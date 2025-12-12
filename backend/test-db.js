"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
const connectionString = 'postgresql://postgres:postgres@localhost:5432/tutor_everywhere';
const client = new pg_1.Client({ connectionString });
console.log('Attempting to connect to:', connectionString);
client.connect()
    .then(() => {
    console.log('Successfully connected to database!');
    return client.end();
})
    .catch((err) => {
    console.error('Connection failed:', err.message);
    process.exit(1);
});
