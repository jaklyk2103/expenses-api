import { generateUuid } from './cryptoUtils';
import { PrimaryKeyValues } from '../db/database.types'; 

export const buildExpenseSortKey = (email: string, id?: string) => {
  return `${PrimaryKeyValues.EXPENSE}#${email}#${id || generateUuid()}`;
};