import UserRepostory from "./user.repository";
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DeleteUserPayload, GetUserPayload, RegisterUserPayload, UpdateUserTokenPayload, User } from "./types/user.types";
import { PrimaryKeyValues } from "../db/database.types";

const randomToken = 'test-random-token';
const sendSpy = jest.fn();
const mockHashPassword = jest.fn();
const mockGenerateRandomToken = jest.fn().mockImplementation(() => randomToken);

jest.mock('@aws-sdk/client-dynamodb', () => ({
  DynamoDBClient: jest.fn().mockImplementation(() => ({
    send: (arg: any) => sendSpy(arg)
  })),
  DeleteItemCommand: jest.fn().mockImplementation((arg) => arg),
  QueryCommand: jest.fn().mockImplementation((arg) => arg),
  PutItemCommand: jest.fn().mockImplementation((arg) => arg),
  UpdateItemCommand: jest.fn().mockImplementation((arg) => arg)
}));
jest.mock('../shared/cryptoUtils', () => ({
  hashPassword: () => mockHashPassword(),
  generateRandomToken: () => mockGenerateRandomToken()
}));

const wrapAsAttributeValue = (value: string) => ({
  S: value
});

describe('UserRepository tests', () => {
  const tableName = 'test-table-name';
  describe('deleteUser method', () => {
    it('Should delete user', async () => {
      const mockDynamoDbClient = new (DynamoDBClient as jest.Mock)();
      const userRepository = new UserRepostory(mockDynamoDbClient, tableName);

      const payload: DeleteUserPayload = {
        email: 'test-email',
        password: 'test-password'
      }
      await userRepository.deleteUser(payload);

      expect(sendSpy.mock.calls).toHaveLength(1);
      expect(sendSpy.mock.calls[0][0]).toMatchObject({
        TableName: tableName,
      Key: {
        ':recordType': {
          S: 'USER'
        },
        'recordUniqueInformation': {
          S: 'test-email'
        }
      }
      });
    });
  });

  describe('getUser method', () => {
    const mockUserRetrievedFromDb = {
      email: wrapAsAttributeValue('test-email@test.com'),
      hashedPassword: wrapAsAttributeValue('123'),
      salt: wrapAsAttributeValue('abc'),
      sessionToken: wrapAsAttributeValue('abc123'),
      sessionTokenValidityTimestampMsUtc: wrapAsAttributeValue('123123123')
    };

    it('Should retrieve user data and map it correctly to User type', async () => {
      sendSpy.mockImplementationOnce(() => ({
        Items: [mockUserRetrievedFromDb]
      }));

      const mockDynamoDbClient = new (DynamoDBClient as jest.Mock)();
      const userRepository = new UserRepostory(mockDynamoDbClient, tableName);

      const payload: GetUserPayload = {
        email: 'test-email@test.com'
      }
      const user = await userRepository.getUser(payload);

      expect(sendSpy.mock.calls).toHaveLength(1);
      expect(sendSpy.mock.calls[0][0]).toMatchObject({
        TableName: tableName,
        ExpressionAttributeValues: {
          ':recordType': {
            S: 'USER'
          },
          ':recordUniqueInformation': {
            S: 'test-email@test.com'
          }
        }, 
        KeyConditionExpression: 'recordType = :recordType AND recordUniqueInformation = :recordUniqueInformation'
      });
      expect(user).toMatchObject({
        email: "test-email@test.com",
        hashedPassword: "123",
        salt: "abc",
        sessionToken: "abc123",
        sessionTokenValidityTimestampMsUtc: "123123123",
      });
    });

    it('Should throw User not found error when user was not found in db', async () => {
      const mockDynamoDbClient = new (DynamoDBClient as jest.Mock)();
      const userRepository = new UserRepostory(mockDynamoDbClient, tableName);

      const payload: GetUserPayload = {
        email: 'test-email@test.com'
      }

      expect(async () => { await userRepository.getUser(payload); }).rejects.toThrowErrorMatchingInlineSnapshot('"User not found"');
    });

    it('Should throw Multiple users with same email found when query returns 2 users', async () => {
      sendSpy.mockImplementationOnce(() => ({
        Items: [
          mockUserRetrievedFromDb,
          mockUserRetrievedFromDb
        ]
      }));

      const mockDynamoDbClient = new (DynamoDBClient as jest.Mock)();
      const userRepository = new UserRepostory(mockDynamoDbClient, tableName);

      const payload: GetUserPayload = {
        email: 'test-email@test.com'
      }

      expect(async () => { await userRepository.getUser(payload); }).rejects.toThrowErrorMatchingInlineSnapshot('"Multiple users with same email found"');
    })
  });

  describe('registerUser method', () => {
    it('Should register user', async () => {
      const hashedPassword = 'test-hashed-password';
      const salt = 'test-salt';
      mockHashPassword.mockImplementationOnce(() => ({ hashedPassword, salt }));

      const mockDynamoDbClient = new (DynamoDBClient as jest.Mock)();
      const userRepository = new UserRepostory(mockDynamoDbClient, tableName);

      const payload: RegisterUserPayload = {
        email: 'test-email',
        password: 'test-password'
      }
      await userRepository.registerUser(payload);

      expect(sendSpy.mock.calls).toHaveLength(1);
      expect(sendSpy.mock.calls[0][0]).toMatchObject({
        TableName: tableName,
        Item: {
          recordType: {
            S: PrimaryKeyValues.USER
          },
          recordUniqueInformation: {
            S: 'test-email'
          },
          hashedPassword: {
            S: hashedPassword
          },
          salt: {
            S: salt
          }
        }
    });
    });
  });

  describe('updateUserToken method', () => {
    it('Should update user token', async () => {
      const mockDynamoDbClient = new (DynamoDBClient as jest.Mock)();
      const userRepository = new UserRepostory(mockDynamoDbClient, tableName);

      const payload: UpdateUserTokenPayload = {
        email: 'test-email'
      }
      await userRepository.updateUserToken(payload);

      expect(sendSpy.mock.calls).toHaveLength(1);
      expect(sendSpy.mock.calls[0][0]).toMatchObject({
        TableName: tableName,
        Key: {
          recordType: {
            S: PrimaryKeyValues.USER
          },
          recordUniqueInformation: {
            S: 'test-email'
          }
        },
        ExpressionAttributeValues: {
          ':newTokenValue': {
            S: randomToken
          },
          ':newTimestampValue': {
            S: expect.any(String)
          }
        },
        UpdateExpression: 'SET sessionToken = :newTokenValue, sessionTokenValidityTimestampMsUtc = :newTimestampValue'
      });
    });
  });
})