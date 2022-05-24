import client from '../database';

export type Category = {
  id: number;
  name: string;
};

export class CategoryStore {
  async index(): Promise<Category[]> {
    try {
      const conn = await client.connect();
      const sql = 'SELECT * FROM categories;';
      const result = await conn.query(sql);
      conn.release();
      return result.rows;
    } catch (err) {
      throw new Error(`cannot get categories: ${err}`)
    }
  }

  async create(body: { name: string }): Promise<Category> {
    try {
      const conn = await client.connect();
      const sql = 'INSERT INTO categories (name) VALUES ($1) RETURNING *;';
      const result = await conn.query(sql, [body.name]);
      conn.release();
      return result.rows[0];
    } catch (err) {
      throw new Error(`cannot get categories: ${err}`)
    }
  }
}