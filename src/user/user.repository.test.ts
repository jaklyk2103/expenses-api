import UserRepostory from "./user.repository";
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DeleteUserPayload } from "./types/user.types";

const sendSpy = jest.fn();

jest.mock('@aws-sdk/client-dynamodb', () => ({
  DynamoDBClient: jest.fn().mockImplementation(() => ({
    send: (arg: any) => sendSpy(arg)
  })),
  DeleteItemCommand: jest.fn().mockImplementation((arg) => arg)
}));

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
  })
})