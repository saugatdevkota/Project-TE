import { Client } from 'pg';

const connectionString = 'postgresql://postgres:postgres@localhost:5432/tutor_everywhere';
const client = new Client({ connectionString });

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
