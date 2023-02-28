export type GetExpensesForUserPayload = {
  email: string
};

export type AddExpensePayload = {
  expenseOwnerEmail: string;
  date: string;
  description: string;
  value: number;
  currency: string;
};

export type Expense = {
  id: string;
  date: string;
  expenseOwnerEmail: string;
  description: string;
  value: number;
  currency: string;
};