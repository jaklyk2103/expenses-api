import express, { NextFunction, Request, Response } from 'express';
import serverless from 'serverless-http';
import router from './router';

const app = express();
app.use(express.json());
app.use((req: Request, res: Response, next: NextFunction ) => {
  res.setHeader('Access-Control-Allow-Origin', 'https://expenses-8c745.web.app');
  next();
});
app.use(router);

exports.handler = serverless(app);