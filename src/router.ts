import express from 'express';
const router = express.Router();

router.get('/expenses', (req, res) => {
  res.send('Hello World!');
});

router.post('/login', (req, res) => {
  res.send('Hello World!');
});

router.post('/expense', (req, res) => {
  res.send('Hello World!');
});

export default router;