import { QueryResult } from 'pg';
import client from '../database';

export type Order = {
  id?: number;
  username: string;
  status: boolean;
};

export type OrderProduct = {
  order_id: number;
  product_id: number;
  quantity: number;
};

export class OrdersStore {
  async index(): Promise<Order[]> {
    try {
      const conn = await client.connect();
      const sql = 'SELECT * FROM orders;';
      const result = await conn.query(sql);
      conn.release();

      return result.rows;
    } catch(err) {
      throw new Error(`unable to get orders: ${err}`);
    }
  }

  async create(order: Order): Promise<Order> {
    try {
      const conn = await client.connect();
      const sql = 'INSERT INTO orders (username, status) VALUES ($1, $2) RETURNING *;'
      const result = await conn.query(sql, [order.username, order.status]);
      conn.release();
      return result.rows[0];
    } catch(err) {
      throw new Error(`unable to create order: ${err}`);
    }
  }

  async show(order_id: number): Promise<Order> {
    try {
      const conn = await client.connect();
      const sql = 'SELECT * FROM orders WHERE id = $1;';
      const result = await conn.query(sql, [order_id]);
      conn.release();

      return result.rows[0];
    } catch(err) {
      throw new Error(`unable to get orders: ${err}`);
    }
  }

  async addProduct(order_id: number, product_id: number, quantity: number): Promise<OrderProduct> {
    try {
      let result: QueryResult;
      let sql: string;
      const conn = await client.connect();

      const orderProduct = await this.getOrderProduct(order_id, product_id);
      if (orderProduct) {
        const newQuantity = orderProduct.quantity + quantity;
        sql = 'UPDATE orders_products SET quantity = $3 WHERE order_id = $1 AND product_id = $2 RETURNING *;'
        result = await conn.query(sql, [order_id, product_id, newQuantity]);
      } else {
        sql = 'INSERT INTO orders_products (order_id, product_id, quantity) VALUES ($1, $2, $3) RETURNING *;'
        result = await conn.query(sql, [order_id, product_id, quantity]);
      }
      conn.release();
      return result.rows[0];
    } catch (err) {
      throw new Error(`unable to add product to order: ${err}`);
    }
  }

  private async getOrderProduct(order_id: number, product_id: number): Promise<OrderProduct | null> {
    try {
      const conn = await client.connect();
      const sql = 'SELECT * FROM orders_products WHERE order_id = $1 AND product_id = $2;';
      const result = await conn.query(sql, [order_id, product_id]);
      conn.release();

      if (result.rows.length) {
        return result.rows[0];
      }
      return null;
    } catch(err) {
      throw new Error(`unable to get order_product: ${err}`);
    }
  }
}