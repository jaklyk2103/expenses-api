import express from 'express';
import serverless from 'serverless-http';
import router from './router';

const app = express();
app.use(express.json());
app.use(router);

exports.handler = serverless(app);