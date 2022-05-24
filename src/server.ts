import express, { Application, Request, Response } from 'express';
import bodyParser from 'body-parser';
import categories_routes from './handlers/categories';

const app: Application = express();
const address: string = 'localhost:3000';

app.use(bodyParser.json());

app.get('/', (req: Request, res: Response) => {
  res.status(200);
  res.send('App is working!');
});

categories_routes(app);

app.listen(3000, () => {
  console.log(`Starting app on: ${address}`);
});

export default app;