import ExpensesRepository from './expenses.repository';
import { Expense } from './expenses.types';
import { GetExpensesForUserPayload } from './types/expense.types';

export default class ExpensesService {
  private expensesRepository: ExpensesRepository;

  constructor(expensesRepository: ExpensesRepository) {
    this.expensesRepository = expensesRepository;
  }

  async getExpensesForUser(payload: GetExpensesForUserPayload): Promise<Expense[]> {
    return this.expensesRepository.getExpensesForUser(payload);
  }

  async getExpenses(): Promise<Expense[]> {
    return this.expensesRepository.getAllExpenses();
  }

  async addExpense(expense: Expense): Promise<void> {
    return this.expensesRepository.addExpense(expense);
  }
}