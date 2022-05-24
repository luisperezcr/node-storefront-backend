import express, { Application, Request, Response } from 'express';
import { Category, CategoryStore } from '../models/categories';

const store = new CategoryStore();

const index = async(_req: Request, res: Response) => {
  const categories = await store.index();
  res.json(categories);
};

const create = async(req: Request, res: Response) => {
  const body = {
    name: req.body.name
  };
  const category = await store.create(body);
  res.json(category);
};

const categories_routes = (app: Application) => {
  app.get('/categories', index);
  app.post('/categories', create);
};

export default categories_routes;