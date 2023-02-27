import express, { NextFunction, Request, Response } from 'express';
import serverless from 'serverless-http';
import router from './router';
import cookieParser from 'cookie-parser';
import { authorizationMiddleware } from './middlewares/authorizationMiddleware';

const app = express();
app.disable('etag');
app.use((req: Request, res: Response, next: NextFunction ) => {
  res.setHeader('Access-Control-Allow-Origin', 'https://expenses-8c745.web.app');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, access-control-allow-origin');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  next();
});
app.use(express.json());
app.use(cookieParser());
app.use(authorizationMiddleware);
app.use(router);

exports.handler = serverless(app);