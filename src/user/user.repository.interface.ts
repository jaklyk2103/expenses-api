import { RegisterUserPayload, UpdateUserTokenPayload, User } from './types/user.types';

export default interface IUserRepository {
  getUser(email: string): Promise<User>;
  updateUserToken(updateUserTokenPayload: UpdateUserTokenPayload): Promise<string>;
  deleteUserToken(): Promise<void>;
  registerUser(registerUserPayload: RegisterUserPayload): Promise<void>;
}