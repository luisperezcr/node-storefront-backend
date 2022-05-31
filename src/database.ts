import dotenv from 'dotenv';
import { Pool } from 'pg';

dotenv.config();

const {
  POSTGRES_HOST,
  POSTGRES_DB_DEV,
  POSTGRES_TEST_DB,
  POSTGRES_USER,
  POSTGRES_PWD,
  ENV
} = process.env;
let client: Pool = new Pool();

// Always use dev env as default
if (ENV === 'dev') {
  client = new Pool({
    host: POSTGRES_HOST,
    database: POSTGRES_DB_DEV,
    user: POSTGRES_USER,
    password: POSTGRES_PWD
  });
}

if (ENV === 'test') {
  client = new Pool({
    host: POSTGRES_HOST,
    database: POSTGRES_TEST_DB,
    user: POSTGRES_USER,
    password: POSTGRES_PWD
  });
}

export default client;
