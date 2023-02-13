import IExpensesRepository from './expenses.repository.interface';
import { Currency } from '../shared/types';
import { Expense } from './expenses.types';

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