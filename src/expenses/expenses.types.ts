import { Currency } from '../shared/types';

export type Expense = {
  expenseOwnerEmail: string;
  description: string;
  value: number;
  currency: string;
};