import { Application, Request, Response } from 'express';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { User, UserStore } from '../models/users';
import verifyAuthToken from '../middlewares/verify-auth-token';

const store = new UserStore();
dotenv.config();

const index = async (_req: Request, res: Response) => {
  try {
    const users = await store.index();
    res.json(users);
  } catch {
    res.status(401);
    res.json('An error occurred!');
  }
};

const create = async (req: Request, res: Response) => {
  try {
    const user: User = {
      username: req.body.username,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      password: req.body.password
    };
    const newUser = await store.create(user);
    const token = jwt.sign(
      { user: newUser },
      process.env.TOKEN_SECRET as string
    );
    res.json({ ...newUser, token: `Bearer ${token}` });
  } catch {
    res.status(401);
    res.json('An error occurred!');
  }
};

const show = async (req: Request, res: Response) => {
  try {
    const username: string = req.params.username;
    const user = await store.show(username);
    res.json(user);
  } catch {
    res.status(401);
    res.json('An error occurred!');
  }
};

const authenticate = async (req: Request, res: Response) => {
  try {
    const user = await store.authenticate(req.body.username, req.body.password);
    const token = jwt.sign({ user: user }, process.env.TOKEN_SECRET as string);
    res.json({ ...user, token: `Bearer ${token}` });
  } catch {
    res.status(401);
    res.json('An error occurred!');
  }
};

const users_routes = (app: Application) => {
  app.get('/users', verifyAuthToken, index);
  app.post('/users', create);
  app.get('/users/:username', verifyAuthToken, show);
  app.post('/users/authenticate', authenticate);
};

export default users_routes;
