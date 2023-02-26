import express, { NextFunction, Request, Response } from 'express';
import serverless from 'serverless-http';
import router from './router';
import cookieParser from 'cookie-parser';

const app = express();
app.disable('etag');
app.use(express.json());
app.use(cookieParser());
app.use((req: Request, res: Response, next: NextFunction ) => {
  res.setHeader('Access-Control-Allow-Origin', 'https://expenses-8c745.web.app');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});
app.use(router);

exports.handler = serverless(app);