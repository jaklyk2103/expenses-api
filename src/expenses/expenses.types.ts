import { Currency } from '../shared/types';

export type Expense = {
  description: string;
  value: number;
  currency: string;
};