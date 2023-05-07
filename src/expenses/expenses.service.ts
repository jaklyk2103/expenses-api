import ExpensesRepository from './expenses.repository';
import { GetExpensesForUserPayload, PutExpensePayload, Expense } from './expenses.types';

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

  async putExpense(putExpensePayload: PutExpensePayload): Promise<void> {
    return this.expensesRepository.putExpense(putExpensePayload);
  }
}