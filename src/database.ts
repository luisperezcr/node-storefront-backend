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
let client: Pool | undefined;

switch (ENV) {
  case 'dev':
    client = new Pool({
      host: POSTGRES_HOST,
      database: POSTGRES_DB_DEV,
      user: POSTGRES_USER,
      password: POSTGRES_PWD
    });
    break;
  case 'test':
    client = new Pool({
      host: POSTGRES_HOST,
      database: POSTGRES_TEST_DB,
      user: POSTGRES_USER,
      password: POSTGRES_PWD
    });
    break;
  default:
    break;
}

export default client;
