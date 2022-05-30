import { Application, Request, Response } from 'express';
import { Product, ProductsStore } from '../models/products';
import verifyAuthToken from '../middlewares/verify-auth-token';

const store = new ProductsStore();

const index = async (_req: Request, res: Response) => {
  const products = await store.index();
  res.json(products);
};

const show = async (req: Request, res: Response) => {
  try {
    const productId = Number(req.params.id);
    const product = await store.show(productId);
    res.json(product);
  } catch {
    res.status(401);
    res.json('An error occurred!');
  }
};

const create = async (req: Request, res: Response) => {
  try {
    const product: Product = {
      name: req.body.name,
      price: +req.body.price,
      category_id: req.body.category_id
    };
    const newProduct = await store.create(product);
    if (!newProduct) {
      res.status(400);
      res.json('The used category does not exist.');
      return;
    }
    res.json(newProduct);
  } catch {
    res.status(401);
    res.json('An error occurred!');
  }
};

const byCategory = async (req: Request, res: Response) => {
  try {
    const categoryId = Number(req.params.id);
    const products = await store.byCategory(categoryId);
    res.json(products);
  } catch {
    res.status(401);
    res.json('An error occurred!');
  }
};

const products_routes = (app: Application) => {
  app.get('/products', index);
  app.get('/products/:id', show);
  app.post('/products', verifyAuthToken, create);
  app.get('/products/category/:id', verifyAuthToken, byCategory);
};

export default products_routes;
