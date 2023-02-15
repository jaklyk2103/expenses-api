import { DeleteUserPayload, LogoutUserPayload, RegisterUserPayload, UpdateUserTokenPayload, User } from './types/user.types';

export default interface IUserRepository {
  registerUser(registerUserPayload: RegisterUserPayload): Promise<void>;
  getUser(email: string): Promise<User>;
  deleteUser(deleteUserPayload: DeleteUserPayload): Promise<void>;
  updateUserToken(updateUserTokenPayload: UpdateUserTokenPayload): Promise<string>;
  deleteUserToken(logoutUserPayload: LogoutUserPayload): Promise<void>;
}