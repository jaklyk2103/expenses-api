import { DynamoDBClient, QueryCommand, UpdateItemCommand } from '@aws-sdk/client-dynamodb';
import { PrimaryKeyValues } from '../db/database.types';
import { generateRandomToken } from '../shared/tokenGenerator';
import ILoginRepository from './login.repository.interface';

export default class LoginRepository implements ILoginRepository {
  private dbClient: DynamoDBClient;
  private tableName: string;

  constructor(dbClient: DynamoDBClient, tableName: string) {
    this.dbClient = dbClient;
    this.tableName = tableName;
  }

  async getUserToken(email: string): Promise<string> {
    const queryCommand = new QueryCommand({
      TableName: this.tableName,
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

    const result = await this.dbClient.send(queryCommand);
    if (!result.Items) {
      throw new Error('User not found');
    } 
    if (result.Items.length > 1) {
      throw new Error('Two same users found');
    }
    const record = result.Items[0];
    return record.token.S || '';
  }
  
  async updateUserToken(email: string): Promise<void> {
    const updateCommand = new UpdateItemCommand({
      TableName: this.tableName,
      Key: {
        recordType: {
          S: PrimaryKeyValues.LOGIN
        },
        recordUniqueInformation: {
          S: email
        }
      },
      ExpressionAttributeValues: {
        ':newTokenValue': {
          S: generateRandomToken()
        }
      },
      UpdateExpression: 'token = :newTokenValue'
    });
    
    await this.dbClient.send(updateCommand);
  }
  deleteUserToken(): Promise<void> {
    throw new Error('Method not implemented.');
  }
  registerUser(): Promise<void> {
    throw new Error('Method not implemented.');
  }
}