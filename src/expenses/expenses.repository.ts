import IExpensesRepository from './expenses.repository.interface';
import { Currency } from '../shared/types';
import { Expense } from './expenses.types';
import { AttributeValue, DynamoDBClient, QueryCommand } from '@aws-sdk/client-dynamodb';
import { PrimaryKeyValues } from '../db/database.types';

export default class ExpensesRepository implements IExpensesRepository {
  async getAllExpenses(): Promise<Expense[]> {
    const dbClient = new DynamoDBClient({ region: 'eu-west-1' });
    const queryCommand = new QueryCommand({
      TableName: 'expenses-test',
      ExpressionAttributeValues: {
        ':recordType': {
          S: PrimaryKeyValues.EXPENSE
        }
      }, 
      KeyConditionExpression: 'recordType = :recordType'
    });
    const result = await dbClient.send(queryCommand);
    console.log(`Items: ${JSON.stringify(result.Items)}`);

    if (!result.Items || !result.Items.length) return [];
    return result.Items.map(this.mapRecordToExpense);
  }

  private mapRecordToExpense(record: Record<string, AttributeValue>): Expense {
    const { currency, description, value } = record;
    return {
      currency: currency?.S || '',
      description: description?.S || '',
      value: Number(value?.N) || 0
    };
  }
}