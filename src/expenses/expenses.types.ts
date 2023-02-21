export type GetExpensesForUserPayload = {
  email: string
};

export type AddExpensePayload = {
  expenseOwnerEmail: string;
  description: string;
  value: number;
  currency: string;
};

export type Expense = {
  id: string;
  expenseOwnerEmail: string;
  description: string;
  value: number;
  currency: string;
};