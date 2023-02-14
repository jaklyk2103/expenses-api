import crypto from 'crypto';

export const generateRandomToken = (): string => {
  return crypto.randomBytes(64).toString('hex');
};