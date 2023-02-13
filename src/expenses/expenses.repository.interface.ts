import { Expense } from './expenses.types';

export default interface IExpensesRepository {
  getAllExpenses(): Promise<Expense[]>;
}