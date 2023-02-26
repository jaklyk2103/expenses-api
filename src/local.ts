import express, { NextFunction, Request, Response } from 'express';
import router from './router';

const PORT = 3003;

const localApp = express();
localApp.use(express.json());

localApp.use((req: Request, res: Response, next: NextFunction) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

localApp.use(router);

localApp.listen(PORT, () => {
  console.log(`Listening locally at port ${PORT}`);
});