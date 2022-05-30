import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import client from '../database';

dotenv.config();

const saltRounds = process.env.SALT_ROUNDS || 10;
const pepper = process.env.BCRYPT_PASSWORD;

export type User = {
  id?: number;
  username: string;
  firstName: string;
  lastName: string;
  password: string;
  token?: string;
};

export class UserStore {
  async index(): Promise<User[]> {
    try {
      const conn = await client.connect();
      const sql = 'SELECT * FROM users';
      const result = await conn.query(sql);
      conn.release();
      return result.rows;
    } catch (err) {
      throw new Error(`unable to get: users ${err}`);
    }
  }

  async create(u: User): Promise<User> {
    try {
      const conn = await client.connect();
      const sql =
        'INSERT INTO users (username, firstName, lastName, password) VALUES ($1, $2, $3, $4) RETURNING *';
      const hash = bcrypt.hashSync(u.password + pepper, Number(saltRounds));
      const result = await conn.query(sql, [
        u.username,
        u.firstName,
        u.lastName,
        hash
      ]);
      conn.release();
      return result.rows[0];
    } catch (err) {
      throw new Error(`unable to create user: ${err}`);
    }
  }

  async show(username: string): Promise<User> {
    try {
      const conn = await client.connect();
      const sql =
        'SELECT username, firstName, lastName FROM users WHERE username = $1';
      const result = await conn.query(sql, [username]);
      conn.release();
      return result.rows[0];
    } catch (err) {
      throw new Error(`unable to get user ${username}: ${err}`);
    }
  }

  async authenticate(username: string, password: string): Promise<User | null> {
    try {
      const conn = await client.connect();
      const sql = 'SELECT password FROM users WHERE username = $1';
      const result = await conn.query(sql, [username]);
      if (result.rows.length) {
        const user = result.rows[0];
        if (bcrypt.compareSync(password + pepper, user.password)) {
          return this.show(username);
        }
      }
      return null;
    } catch (err) {
      throw new Error(`unable to authenticate as ${username}: ${err}`);
    }
  }
}
