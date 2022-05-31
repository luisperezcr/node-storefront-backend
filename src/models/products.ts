import client from '../database';
import { CategoryStore } from './categories';

const categoryStore = new CategoryStore();

export type Product = {
  id?: number;
  name: string;
  price: number;
  category_id: number;
};

export class ProductsStore {
  async index(): Promise<Product[]> {
    if (client) {
      try {
        const conn = await client.connect();
        const sql = 'SELECT * FROM products;';
        const result = await conn.query(sql);
        conn.release();
        return result.rows;
      } catch (err) {
        throw new Error(`unable to get products: ${err}`);
      }
    } else {
      throw new Error(`cannot connect to database`);
    }
  }

  async show(id: number): Promise<Product | null> {
    if (client) {
      try {
        const conn = await client.connect();
        const sql = 'SELECT * FROM products WHERE id = $1;';
        const result = await conn.query(sql, [id]);
        conn.release();
        if (result.rows.length) {
          return result.rows[0];
        }
        return null;
      } catch (err) {
        throw new Error(`unable to get products: ${err}`);
      }
    } else {
      throw new Error(`cannot connect to database`);
    }
  }

  async create(product: Product): Promise<Product | null> {
    if (client) {
      try {
        const isValidCategory = await this.checkCategory(product.category_id);
        if (!isValidCategory) {
          return null;
        }
        const conn = await client.connect();
        const sql =
          'INSERT INTO products (name, price, category_id) VALUES ($1, $2, $3) RETURNING *;';
        const result = await conn.query(sql, [
          product.name,
          product.price,
          product.category_id
        ]);
        conn.release();
        return result.rows[0];
      } catch (err) {
        throw new Error(`unable to get products: ${err}`);
      }
    } else {
      throw new Error(`cannot connect to database`);
    }
  }

  async byCategory(categoryId: number): Promise<Product[]> {
    if (client) {
      try {
        const conn = await client.connect();
        const sql = `SELECT P.id, P.name, P.price, P.category_id FROM products P INNER JOIN categories C ON p.category_id = C.id WHERE p.category_id = $1 GROUP BY C.id,p.id;`;
        const result = await conn.query(sql, [categoryId]);
        conn.release();
        return result.rows;
      } catch (err) {
        throw new Error(`unable to get products by category: ${err}`);
      }
    } else {
      throw new Error(`cannot connect to database`);
    }
  }

  private async checkCategory(id: number): Promise<boolean> {
    const category = await categoryStore.show(id);
    return !!category;
  }
}
