import express from 'express';
const router = express.Router();
import ExpensesService from './expenses/expenses.service';
import ExpensesRepository from './expenses/expenses.repository';

router.get('/expenses', async (req, res) => {
  const expensesRepository = new ExpensesRepository();
  const expensesService = new ExpensesService(expensesRepository);

  return await expensesService.getExpenses();
});

router.post('/login', (req, res) => {
  res.send('Hello World!');
});

router.post('/expense', (req, res) => {
  res.send('Hello World!');
});

export default router;