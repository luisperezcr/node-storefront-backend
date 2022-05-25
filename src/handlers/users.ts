import { Application, Request, Response } from 'express';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { User, UserStore } from '../models/users';
import verifyAuthToken from '../middlewares/verify-auth-token';

const store = new UserStore();
dotenv.config();

const index = async (_req: Request, res: Response) => {
  const users = await store.index();
  res.json(users);
};

const create = async (req: Request, res: Response) => {
  const user: User = {
    username: req.body.username,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    password: req.body.password
  };
  const newUser = await store.create(user);
  const token = jwt.sign({ user: user }, process.env.TOKEN_SECRET as string, {
    expiresIn: '2h'
  });
  res.json({ ...newUser, token: `Bearer ${token}` });
};

const getById = async (req: Request, res: Response) => {
  const username: string = req.params.username;
  const user = await store.getById(username);
  res.json(user);
};

const authenticate = async (req: Request, res: Response) => {
  const user = await store.authenticate(req.body.username, req.body.password);
  const token = jwt.sign({ user: user }, process.env.TOKEN_SECRET as string, {
    expiresIn: '2h'
  });
  res.json({ ...user, token: `Bearer ${token}` });
};

const users_routes = (app: Application) => {
  app.get('/users', verifyAuthToken, index);
  app.post('/users', create);
  app.get('/users/:username', verifyAuthToken, getById);
  app.post('/users/authenticate', authenticate);
};

export default users_routes;
