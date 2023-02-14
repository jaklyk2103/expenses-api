import { DynamoDBClient, QueryCommand } from '@aws-sdk/client-dynamodb';
import { PrimaryKeyValues } from '../db/database.types';
import ILoginRepository from './login.repository.interface';

export default class LoginRepository implements ILoginRepository {
  async getUserToken(email: string): Promise<string> {
    const dbClient = new DynamoDBClient({ region: 'eu-west-1' });
    const queryCommand = new QueryCommand({
      TableName: 'expenses-test',
      ExpressionAttributeValues: {
        ':recordType': {
          S: PrimaryKeyValues.LOGIN
        },
        ':uniqueInformation': {
          S: email
        }
      }, 
      KeyConditionExpression: 'recordType = :recordType AND recordUniqueInformation = :uniqueInformation'
    });

    const result = await dbClient.send(queryCommand);
    if (!result.Items) {
      throw new Error('User not found');
    } 
    if (result.Items.length > 1) {
      throw new Error('Two same users found');
    }
    const record = result.Items[0];
    return record.token.S || '';
  }
  updateUserToken(): Promise<void> {
    throw new Error('Method not implemented.');
  }
  deleteUserToken(): Promise<void> {
    throw new Error('Method not implemented.');
  }
  registerUser(): Promise<void> {
    throw new Error('Method not implemented.');
  }
}