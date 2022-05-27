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

export type OrderWithProducts = {
  id: number;
  username: string;
  status: string;
  products: []
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

  async show(username: string, order_id: number): Promise<OrderWithProducts | null> {
    try {
      const conn = await client.connect();
      const orderSql = 'SELECT * FROM orders WHERE username = $1 AND id = $2;';
      const orderResult = await conn.query(orderSql, [username, order_id]);
      const productsSql = 'SELECT p.id, p.name, op.quantity FROM orders_products op INNER JOIN products p ON p.id = op.product_id WHERE op.order_id = $1;';
      const productsResult = await conn.query(productsSql, [order_id]);
      conn.release();
      
      if (orderResult.rows.length) {
        const result = {
          ...orderResult.rows[0],
          products: productsResult.rows
        };
        return result;
      }
      return null;
    } catch(err) {
      throw new Error(`unable to get orders with products: ${err}`);
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