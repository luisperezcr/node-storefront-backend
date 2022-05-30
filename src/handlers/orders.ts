import { Application, Request, Response } from 'express';
import { OrdersStore } from '../models/orders';
import verifyAuthToken from '../middlewares/verify-auth-token';

const store = new OrdersStore();

const index = async (_req: Request, res: Response) => {
  const orders = await store.index();
  res.json(orders);
};

const create = async (req: Request, res: Response) => {
  try {
    const newOrder = {
      username: req.body.username,
      status: req.body.status
    };
    const order = await store.create(newOrder);
    res.json(order);
  } catch {
    res.status(401);
    res.json('An error occurred!');
  }
};

const show = async (req: Request, res: Response) => {
  try {
    const orderId = Number(req.params.id);
    const username = req.params.username;
    const order = await store.show(username, orderId);
    res.json(order);
  } catch {
    res.status(401);
    res.json('An error occurred!');
  }
};

const addProduct = async (req: Request, res: Response) => {
  try {
    const orderProduct = {
      order_id: req.params.id,
      product_id: req.body.product_id,
      quantity: req.body.quantity
    };
    const newOrderProduct = await store.addProduct(
      +orderProduct.order_id,
      orderProduct.product_id,
      orderProduct.quantity
    );
    res.json(newOrderProduct);
  } catch {
    res.status(401);
    res.json('An error occurred!');
  }
};

const orders_routes = (app: Application) => {
  app.get('/orders', verifyAuthToken, index);
  app.get('/orders/:id/:username', verifyAuthToken, show);
  app.post('/orders', verifyAuthToken, create);
  app.post('/orders/:id/products', verifyAuthToken, addProduct);
};

export default orders_routes;
