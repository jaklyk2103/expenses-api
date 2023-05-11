export type GetExpensesForUserPayload = {
  email: string
};

export type PutExpensePayload = {
  expenseOwnerEmail: string;
  date: string;
  description: string;
  value: number;
  currency: string;
  id?: string;
};

export type DeleteExpensePayload = {
  email: string;
  id: string;
}

export type Expense = {
  id: string;
  date: string;
  expenseOwnerEmail: string;
  description: string;
  value: number;
  currency: string;
};