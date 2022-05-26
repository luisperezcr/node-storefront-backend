import { Application, Request, Response } from 'express';
import { Category, CategoryStore } from '../models/categories';
import verifyAuthToken from '../middlewares/verify-auth-token';

const store = new CategoryStore();

const index = async (_req: Request, res: Response) => {
  const categories = await store.index();
  res.json(categories);
};

const create = async (req: Request, res: Response) => {
  const newCategory: Category = {
    name: req.body.name
  };
  const category = await store.create(newCategory);
  res.json(category);
};

const categories_routes = (app: Application) => {
  app.get('/categories', index);
  app.post('/categories', verifyAuthToken, create);
};

export default categories_routes;
