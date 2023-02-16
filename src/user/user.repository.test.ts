import UserRepostory from "./user.repository";
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DeleteUserPayload, GetUserPayload, User } from "./types/user.types";

const sendSpy = jest.fn();

jest.mock('@aws-sdk/client-dynamodb', () => ({
  DynamoDBClient: jest.fn().mockImplementation(() => ({
    send: (arg: any) => sendSpy(arg)
  })),
  DeleteItemCommand: jest.fn().mockImplementation((arg) => arg),
  QueryCommand: jest.fn().mockImplementation((arg) => arg)
}));

const wrapAsAttributeValue = (value: string) => ({
  S: value
});

describe('UserRepository tests', () => {
  describe('deleteUser method', () => {
    it('Should delete user', async () => {
      const mockDynamoDbClient = new (DynamoDBClient as jest.Mock)();
      const userRepository = new UserRepostory(mockDynamoDbClient, 'test-table-name');

      const payload: DeleteUserPayload = {
        email: 'test-email',
        password: 'test-password'
      }
      await userRepository.deleteUser(payload);

      expect(sendSpy.mock.calls).toHaveLength(1);
      expect(sendSpy.mock.calls[0][0]).toMatchObject({
        TableName: 'test-table-name',
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

    it('Should retrieve user data and maps it correctly to User type', async () => {
      sendSpy.mockImplementationOnce(() => ({
        Items: [mockUserRetrievedFromDb]
      }));

      const mockDynamoDbClient = new (DynamoDBClient as jest.Mock)();
      const userRepository = new UserRepostory(mockDynamoDbClient, 'test-table-name');

      const payload: GetUserPayload = {
        email: 'test-email@test.com'
      }
      const user = await userRepository.getUser(payload);

      expect(sendSpy.mock.calls).toHaveLength(1);
      expect(sendSpy.mock.calls[0][0]).toMatchObject({
        TableName: 'test-table-name',
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

    it('Should throw "User not found" error when user was not found in db', async () => {



    });

    it('Should throw "Multiple users with same email found" when query returns 2 users', async () => {
      sendSpy.mockImplementationOnce(() => ({
        Items: [
          mockUserRetrievedFromDb,
          mockUserRetrievedFromDb
        ]
      }));
    })
  });
})