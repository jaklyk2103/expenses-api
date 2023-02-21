import ExpensesRepository from './expenses.repository';
import { GetExpensesForUserPayload, AddExpensePayload, Expense } from './expenses.types';

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

  async addExpense(addExpensePayload: AddExpensePayload): Promise<void> {
    return this.expensesRepository.addExpense(addExpensePayload);
  }
}