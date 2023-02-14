import express, { Request, Response } from 'express';
const router = express.Router();
import ExpensesService from './expenses/expenses.service';
import ExpensesRepository from './expenses/expenses.repository';
import LoginService from './login/login.service';

router.get('/expenses', async (req: Request, res: Response) => {
  const expensesRepository = new ExpensesRepository();
  const expensesService = new ExpensesService(expensesRepository);

  const expenses = await expensesService.getExpenses();
  return res.json(expenses).status(200);
});

router.post('/login', (req: Request, res: Response) => {
  const loginService = new LoginService();
  res.send('Hello World!');
});

router.post('/expense', (req: Request, res: Response) => {
  res.send('Hello World!');
});

export default router;