import { LogoutUserPayload, RegisterUserPayload, UpdateUserTokenPayload, User } from './types/user.types';

export default interface IUserRepository {
  getUser(email: string): Promise<User>;
  updateUserToken(updateUserTokenPayload: UpdateUserTokenPayload): Promise<string>;
  deleteUserToken(logoutUserPayload: LogoutUserPayload): Promise<void>;
  registerUser(registerUserPayload: RegisterUserPayload): Promise<void>;
}