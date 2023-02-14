import IExpensesRepository from './expenses.repository.interface';
import { Currency } from '../shared/types';
import { Expense } from './expenses.types';
import { DynamoDB } from '@aws-sdk/client-dynamodb';

export default class ExpensesRepository implements IExpensesRepository {
  async getAllExpenses(): Promise<Expense[]> {
    const dynamodb = new DynamoDB();
    const result = await dynamodb.query({
      TableName: 'expenses-test',
      ExpressionAttributeValues: {
        ':v1': {
          S: 'LOGIN'
        }
      }, 
      KeyConditionExpression: 'recordType = :v1'
    }).promise();
    console.log(`Items: ${result.Items}`);

    return [{
      currency: Currency.PLN,
      description: 'desc',
      value: 20,
    }];
  }
}