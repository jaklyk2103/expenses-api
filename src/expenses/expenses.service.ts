import ExpensesRepository from './expenses.repository';
import { Expense } from './expenses.types';

export default class ExpensesService {
  private expensesRepository: ExpensesRepository;

  constructor(expensesRepository: ExpensesRepository) {
    this.expensesRepository = expensesRepository;
  }

  async getExpenses(): Promise<Expense[]> {
    return this.expensesRepository.getAllExpenses();
  }
}