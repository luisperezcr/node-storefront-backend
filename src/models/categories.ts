import client from '../database';

export type Category = {
  id?: number;
  name: string;
};

export class CategoryStore {
  async index(): Promise<Category[]> {
    if (client) {
      try {
        const conn = await client.connect();
        const sql = 'SELECT * FROM categories;';
        const result = await conn.query(sql);
        conn.release();
        return result.rows;
      } catch (err) {
        throw new Error(`cannot get categories: ${err}`);
      }
    } else {
      throw new Error(`cannot connect to database`);
    }
  }

  async create(body: { name: string }): Promise<Category> {
    if (client) {
      try {
        const conn = await client.connect();
        const sql = 'INSERT INTO categories (name) VALUES ($1) RETURNING *;';
        const result = await conn.query(sql, [body.name]);
        conn.release();
        return result.rows[0];
      } catch (err) {
        throw new Error(`cannot create category: ${err}`);
      }
    } else {
      throw new Error(`cannot connect to database`);
    }
  }

  async show(id: number): Promise<Category | null> {
    if (client) {
      try {
        const conn = await client.connect();
        const sql = 'SELECT * FROM categories WHERE id = $1;';
        const result = await conn.query(sql, [id]);
        conn.release();
        if (result.rows.length) {
          return result.rows[0];
        }
        return null;
      } catch (err) {
        throw new Error(`cannot get category: ${err}`);
      }
    } else {
      throw new Error(`cannot connect to database`);
    }
  }
}
