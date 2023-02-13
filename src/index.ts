import express from 'express';
const app = express();
const port = 3000;

app.get('/expenses', (req, res) => {
  res.send('Hello World!');
});

app.post('/login', (req, res) => {
  res.send('Hello World!');
});

app.post('/expense', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});