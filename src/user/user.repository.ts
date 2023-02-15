import { AttributeValue, DynamoDBClient, QueryCommand, UpdateItemCommand, PutItemCommand, DeleteItemCommand } from '@aws-sdk/client-dynamodb';
import { PrimaryKeyValues } from '../db/database.types';
import { generateRandomToken, hashPassword } from '../shared/cryptoUtils';
import IUserRepository from './user.repository.interface';
import { DeleteUserPayload, LogoutUserPayload, RegisterUserPayload, UpdateUserTokenPayload, User } from './types/user.types';

export default class UserRepostory implements IUserRepository {
  private dbClient: DynamoDBClient;
  private tableName: string;
  private sessionTokenLifeDurationMs = 2592000000; // 30days

  constructor(dbClient: DynamoDBClient, tableName: string) {
    this.dbClient = dbClient;
    this.tableName = tableName;
  }

  async deleteUser(deleteUserPayload: DeleteUserPayload): Promise<void> {
    const { email } = deleteUserPayload;
    const deleteItemCommand = new DeleteItemCommand({
      TableName: this.tableName,
      Key: {
        ':recordType': {
          S: PrimaryKeyValues.USER
        },
        'recordUniqueInformation': {
          S: email
        }
      }
    });
    await this.dbClient.send(deleteItemCommand);
  }

  async getUser(email: string): Promise<User> {
    const queryCommand = new QueryCommand({
      TableName: this.tableName,
      ExpressionAttributeValues: {
        ':recordType': {
          S: PrimaryKeyValues.USER
        },
        ':recordUniqueInformation': {
          S: email
        }
      }, 
      KeyConditionExpression: 'recordType = :recordType AND recordUniqueInformation = :recordUniqueInformation'
    });

    const result = await this.dbClient.send(queryCommand);
    if (!result.Items) {
      throw new Error('User not found');
    } 
    if (result.Items.length > 1) {
      throw new Error('Two same users found');
    }
    const userRecord = result.Items[0];
    return this.mapUserRecordToUser(userRecord);
  }
  
  async updateUserToken(updateUserTokenPayload: UpdateUserTokenPayload): Promise<string> {
    const { email } = updateUserTokenPayload;
    const newTokenValue = generateRandomToken();
    const updateItemCommand = new UpdateItemCommand({
      TableName: this.tableName,
      Key: {
        recordType: {
          S: PrimaryKeyValues.USER
        },
        recordUniqueInformation: {
          S: email
        }
      },
      ExpressionAttributeValues: {
        ':newTokenValue': {
          S: newTokenValue
        },
        ':newTimestampValue': {
          S: this.calculateSessionTokenExpiryTimestamp()
        }
      },
      UpdateExpression: 'SET sessionToken = :newTokenValue, sessionTokenValidityTimestampMsUtc = :newTimestampValue'
    });
    
    await this.dbClient.send(updateItemCommand);
    return newTokenValue;
  }

  async deleteUserToken(logoutUserPayload: LogoutUserPayload): Promise<void> {
    const { email } = logoutUserPayload;

    const updateItemCommand = new UpdateItemCommand({
      TableName: this.tableName,
      Key: {
        recordType: {
          S: PrimaryKeyValues.USER
        },
        recordUniqueInformation: {
          S: email
        }
      },
      ExpressionAttributeValues: {
        ':nullValue': {
          NULL: true
        }
      },
      UpdateExpression: 'SET sessionToken = :nullValue, sessionTokenValidityTimestampMsUtc = :nullValue'
    });
    await this.dbClient.send(updateItemCommand);
  }

  async registerUser(registerUserPayload: RegisterUserPayload): Promise<void> {
    const { email, password } = registerUserPayload;

    const { hashedPassword, salt } = await hashPassword(password);

    const putItemCommand = new PutItemCommand({
      TableName: this.tableName,
      Item: {
        recordType: {
          S: PrimaryKeyValues.USER
        },
        recordUniqueInformation: {
          S: email
        },
        hashedPassword: {
          S: hashedPassword
        },
        salt: {
          S: salt
        }
      }
    });
    
    await this.dbClient.send(putItemCommand);
  }

  private mapUserRecordToUser(userItem: Record<string, AttributeValue>): User {
    const { email, hashedPassword, salt, sessionToken, sessionTokenValidityTimestampMsUtc } = userItem;
    return {
      email: email?.S || '',
      hashedPassword: hashedPassword?.S || '',
      salt: salt?.S || '',
      sessionToken: sessionToken?.S || '',
      sessionTokenValidityTimestampMsUtc: sessionTokenValidityTimestampMsUtc?.S || '',
    };
  }

  private calculateSessionTokenExpiryTimestamp(): string {
    return (new Date().getTime() + this.sessionTokenLifeDurationMs).toString();
  }
}