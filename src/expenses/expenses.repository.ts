import IExpensesRepository from './expenses.repository.interface';
import { buildExpenseSortKey } from '../shared/dbUtils';
import { PutExpensePayload, Expense } from './expenses.types';
import { generateUuid } from '../shared/cryptoUtils';
import { AttributeValue, DynamoDBClient, QueryCommand, PutItemCommand } from '@aws-sdk/client-dynamodb';
import { PrimaryKeyValues } from '../db/database.types';
import { GetExpensesForUserPayload } from './expenses.types';

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

  async putExpense(putExpensePayload: PutExpensePayload): Promise<void> {
    const { expenseOwnerEmail, date, description, value, currency, id } = putExpensePayload;
    console.log(`addExpensePayload: ${JSON.stringify(putExpensePayload)}`);
    const putItemCommand = new PutItemCommand({
      TableName: this.tableName,
      Item: {
        recordType: {
          S: PrimaryKeyValues.EXPENSE
        },
        recordUniqueInformation: {
          S: buildExpenseSortKey(expenseOwnerEmail, id)
        },
        expenseOwnerEmail: {
          S: expenseOwnerEmail
        },
        date: {
          S: date
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
    const { expenseOwnerEmail, date, currency, description, value, recordUniqueInformation } = record;
    const id = recordUniqueInformation?.S?.split('#')[2] || generateUuid();
    return {
      id,
      date: date?.S || '',
      expenseOwnerEmail: expenseOwnerEmail?.S || '',
      currency: currency?.S || '',
      description: description?.S || '',
      value: Number(value?.N) || 0
    };
  }
}