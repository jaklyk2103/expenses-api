import IExpensesRepository from './expenses.repository.interface';
import { Currency, Expense } from '../shared/types';

export default class ExpensesRepository implements IExpensesRepository {
  async getAllExpenses(): Promise<Expense[]> {
    return [
      {
        description: 'na waciki',
        value: 50,
        currency: Currency.PLN
      }
    ];
  }
}