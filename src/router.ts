import express, { Request, Response } from 'express';
const router = express.Router();
import ExpensesService from './expenses/expenses.service';
import ExpensesRepository from './expenses/expenses.repository';
import UserService from './user/user.service';
import UserRepository from './user/user.repository';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'; 

const dynamoDbClient = new DynamoDBClient({ region: 'eu-west-1' });

router.get('/expenses', async (req: Request, res: Response) => {
  const expensesRepository = new ExpensesRepository(dynamoDbClient, 'expenses-test');
  const expensesService = new ExpensesService(expensesRepository);

  const expenses = await expensesService.getExpenses();
  return res.json(expenses).status(200);
});

router.get('/user/expenses', async (req: Request, res: Response) => {
  const expensesRepository = new ExpensesRepository(dynamoDbClient, 'expenses-test');
  const expensesService = new ExpensesService(expensesRepository);

  const email = req.query.email as string;

  const expenses = await expensesService.getExpensesForUser({ email });
  return res.json(expenses).status(200);
});

router.post('/expense', async (req: Request, res: Response) => {
  const expensesRepository = new ExpensesRepository(dynamoDbClient, 'expenses-test');
  const expensesService = new ExpensesService(expensesRepository);

  await expensesService.putExpense({
    ...req.body
  });

  res.status(200).send('Put expense');
});

router.post('/delete-expense', async (req: Request, res: Response) => {
  const expensesRepository = new ExpensesRepository(dynamoDbClient, 'expenses-test');
  const expensesService = new ExpensesService(expensesRepository);

  await expensesService.deleteExpense({
    ...req.body
  });

  res.status(200).send('Expense deleted');
})

router.post('/login', async (req: Request, res: Response) => {
  const userRepository = new UserRepository(dynamoDbClient, 'expenses-test');
  const userService = new UserService(userRepository);

  const { email, password } = req.body;
  const sessionToken = await userService.loginUser({
    email,
    password
  });
  res.cookie('userSessionToken', sessionToken, { path: '/', httpOnly: true, secure: true, sameSite: 'none' })
    .cookie('userEmail', email, { path: '/', httpOnly: true, secure: true, sameSite: 'none' })
    .status(200)
    .send(sessionToken);
});

router.post('/logout', async (req: Request, res: Response) => {
  const userRepository = new UserRepository(dynamoDbClient, 'expenses-test');
  const userService = new UserService(userRepository);

  const { email } = req.body;
  await userService.logoutUser({ email });
  res.status(200).send('User logged out successfully.');
});

router.post('/register', async (req: Request, res: Response) => {
  const userRepository = new UserRepository(dynamoDbClient, 'expenses-test');
  const userService = new UserService(userRepository);

  const { email, password } = req.body;
  await userService.registerUser({
    email,
    password
  });
  res.status(200).send('Success');
});

router.post('/user/delete', async (req: Request, res: Response) => {
  const userRepository = new UserRepository(dynamoDbClient, 'expenses-test');
  const userService = new UserService(userRepository);

  const { email, password } = req.body;
  await userService.deleteUser({ email, password });
  res.status(200).send('Deleted user successfully');
});

export default router;