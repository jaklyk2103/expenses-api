import cookieParser from 'cookie-parser';
import express, { NextFunction, Request, Response } from 'express';
import { authorizationMiddleware } from './middlewares/authorizationMiddleware';
import router from './router';

const PORT = 3003;

const localApp = express();
localApp.use((req: Request, res: Response, next: NextFunction) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, access-control-allow-origin');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  next();
});
localApp.use(express.json());
localApp.use(cookieParser());
localApp.use(authorizationMiddleware);

localApp.use(router);

localApp.listen(PORT, () => {
  console.log(`Listening locally at port ${PORT}`);
});