import express from 'express';
import router from './router';

const PORT = 3000;

const localApp = express();
localApp.use(router);

localApp.listen(PORT, () => {
  console.log(`Listening locally at port ${PORT}`);
});