import IExpensesRepository from './expenses.repository.interface';
import { Currency } from '../shared/types';
import { buildExpenseSortKey } from '../shared/dbUtils';
import { Expense } from './expenses.types';
import { generateUuid } from '../shared/cryptoUtils';
import { AttributeValue, DynamoDBClient, QueryCommand, PutItemCommand } from '@aws-sdk/client-dynamodb';
import { PrimaryKeyValues } from '../db/database.types';
import { GetExpensesForUserPayload } from './types/expense.types';

export default class ExpensesRepository implements IExpensesRepository {
  private dbClient: DynamoDBClient;
  private tableName: string;

  constructor(dbClient: DynamoDBClient, tableName: string) {
    this.dbClient = dbClient;
    this.tableName = tableName;
  }

  async getAllExpenses(): Promise<Expense[]> {

    const queryCommand = new QueryCommand({
      TableName: 'expenses-test',
      ExpressionAttributeValues: {
        ':recordType': {
          S: PrimaryKeyValues.EXPENSE
        }
      }, 
      KeyConditionExpression: 'recordType = :recordType'
    });
    const result = await this.dbClient.send(queryCommand);

    if (!result.Items || !result.Items.length) return [];
    return result.Items.map(this.mapRecordToExpense);
  }

  async getExpensesForUser(payload: GetExpensesForUserPayload): Promise<Expense[]> {
    const { email } = payload;
    const queryCommand = new QueryCommand({
      TableName: this.tableName,
      ExpressionAttributeValues: {
        ':recordType': {
          S: PrimaryKeyValues.EXPENSE
        },
        ':recordUniqueInformation': {
          S: `${PrimaryKeyValues.EXPENSE}#${email}`
        }
      }, 
      KeyConditionExpression: 'recordType = :recordType AND begins_with(recordUniqueInformation, :recordUniqueInformation)'
    });

    const result = await this.dbClient.send(queryCommand);

    if (!result.Items || !result.Items.length) return [];
    return result.Items.map(this.mapRecordToExpense);
  }

  async addExpense(expense: Expense): Promise<void> {
    const { expenseOwnerEmail, description, value, currency } = expense;
    const putItemCommand = new PutItemCommand({
      TableName: this.tableName,
      Item: {
        recordType: {
          S: PrimaryKeyValues.EXPENSE
        },
        recordUniqueInformation: {
          S: buildExpenseSortKey(expenseOwnerEmail)
        },
        expenseOwnerEmail: {
          S: expenseOwnerEmail
        },
        value: {
          N: value.toString()
        },
        currency: {
          S: currency
        },
        description: {
          S: description
        }
      }
    });
    await this.dbClient.send(putItemCommand);
  }

  private mapRecordToExpense(record: Record<string, AttributeValue>): Expense {
    const { expenseOwnerEmail, currency, description, value } = record;
    return {
      expenseOwnerEmail: expenseOwnerEmail?.S || '',
      currency: currency?.S || '',
      description: description?.S || '',
      value: Number(value?.N) || 0
    };
  }
}