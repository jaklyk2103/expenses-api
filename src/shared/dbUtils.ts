import { generateUuid } from './cryptoUtils';
import { PrimaryKeyValues } from '../db/database.types'; 

export const buildExpenseSortKey = (email: string) => {
  return `${PrimaryKeyValues.EXPENSE}#${email}#${generateUuid()}`;
}