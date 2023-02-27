import { DynamoDBClient } from '@aws-sdk/client-dynamodb';

export const dynamoDbClient = new DynamoDBClient({ region: 'eu-west-1' });