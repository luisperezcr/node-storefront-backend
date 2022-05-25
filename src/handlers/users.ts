import express, { Application, Request, Response } from 'express';
import { User, UserStore } from '../models/users';

const store = new UserStore();

const index = async(_req: Request, res: Response) => {
  const users = await store.index();
  res.json(users);
};

const create = async(req: Request, res: Response) => {
  const body: User = {
    username: req.body.username,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    password: req.body.password
  };
  const user = await store.create(body);
  res.json(user);
};

const getById = async(req: Request, res: Response) => {
  const username: string = req.params.username;
  const user = await store.getById(username);
  res.json(user);
};

const authenticate = async(req: Request, res: Response) => {
  const user = await store.authenticate(req.body.username, req.body.password);
  res.json(user);
};

const users_routes = (app: Application) => {
  app.get('/users', index);
  app.post('/users', create);
  app.get('/users/:username', getById);
  app.post('/users/authenticate', authenticate);
};

export default users_routes;