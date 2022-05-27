import { Application, Request, Response } from 'express';
import { OrdersStore } from '../models/orders';
import verifyAuthToken from '../middlewares/verify-auth-token';

const store = new OrdersStore();

const index = async(_req: Request, res: Response) => {
  const orders = await store.index();
  res.json(orders);
};

const create = async (req: Request, res: Response) => {
  const newOrder = {
    username: req.body.username,
    status: req.body.status
  }
  const order = await store.create(newOrder);
  res.json(order);
};

const show = async(req: Request, res: Response) => {
  const orderId = Number(req.params.id);
  const order = await store.show(orderId);
  res.json(order);
};

const addProduct = async(req: Request, res: Response) => {
  const orderProduct = {
    order_id: req.params.id,
    product_id: req.body.product_id,
    quantity: req.body.quantity
  };
  const newOrderProduct = await store.addProduct(+orderProduct.order_id, orderProduct.product_id, orderProduct.quantity);
  res.json(newOrderProduct);
};

const orders_routes = (app: Application) => {
  app.get('/orders', index);
  app.get('/orders/:id', show);
  app.post('/orders', verifyAuthToken, create);
  app.post('/orders/:id/products', verifyAuthToken, addProduct);
};

export default orders_routes;
