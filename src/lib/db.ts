import pg from 'pg';

const { Pool } = pg;
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('Falta la variable DATABASE_URL');
}

export const db = new Pool({
  connectionString,
  max: 10,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 5_000
});

db.on('error', (error) => {
  console.error('Error inesperado en PostgreSQL:', error);
});
