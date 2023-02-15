import crypto from 'crypto';

export type HashPasswordOutput = {
  hashedPassword: string,
  salt: string
};

export type HashedPasswordVerificationPayload = {
  password: string,
  salt: string,
  hashedPassword: string
};

export const generateRandomToken = (): string => {
  return crypto.randomBytes(64).toString('hex');
};

export const hashPassword = (password: string): Promise<HashPasswordOutput> => {
  const salt = crypto.randomBytes(16).toString('hex');

  return new Promise<HashPasswordOutput>((resolve, reject) => {
    crypto.pbkdf2(password, salt, 1000, 64, 'sha-512', (error, derivedKey) => {
      if (error) reject(error);
      resolve({ 
        hashedPassword: derivedKey.toString('hex'),
        salt 
      });
    });
  });
};

export const isHashedPasswordCorrect = (hashedPasswordVerificationPayload: HashedPasswordVerificationPayload): Promise<boolean> => {
  const { hashedPassword, password, salt } = hashedPasswordVerificationPayload;
  console.log(`do I have the payload?: ${JSON.stringify(hashedPasswordVerificationPayload)}`);
  return new Promise((resolve, reject) => {
    crypto.pbkdf2(password, salt, 1000, 64, 'sha512', (error, derivedKey) => {
      if (error) reject(error);
      resolve(derivedKey.toString('hex') === hashedPassword);
    });
  });
};