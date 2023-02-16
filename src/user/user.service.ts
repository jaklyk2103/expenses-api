import IUserRepository from './user.repository.interface';
import { DeleteUserPayload, LoginUserPayload, LogoutUserPayload, RegisterUserPayload, UserCredentialVerificationPayload } from './types/user.types';
import { isHashedPasswordCorrect } from '../shared/cryptoUtils';

export default class UserService {
  private userRepository: IUserRepository;

  constructor(loginRepository: IUserRepository) {
    this.userRepository = loginRepository;
  }

  async registerUser(registerUserPayload: RegisterUserPayload): Promise<void> {
    return await this.userRepository.registerUser(registerUserPayload);
  }

  async loginUser(loginUserPayload: LoginUserPayload): Promise<string> {
    const { email, password } = loginUserPayload;
    const areUsersCredentialsCorrect = await this.areUsersCredentialsCorrect({ email, password });
    if (!areUsersCredentialsCorrect) throw new Error('Users credentials incorrect.');

    return this.userRepository.updateUserToken(loginUserPayload);
  }

  async logoutUser(logoutUserPayload: LogoutUserPayload): Promise<void> {
    return this.userRepository.deleteUserToken(logoutUserPayload);
  }

  async deleteUser(deleteUserPayload: DeleteUserPayload): Promise<void> {
    const areUsersCredentialsCorrect = await this.areUsersCredentialsCorrect(deleteUserPayload);
    if (!areUsersCredentialsCorrect) throw new Error('Users credentials incorrect.');
    return this.userRepository.deleteUser(deleteUserPayload);
  }

  private async areUsersCredentialsCorrect(userCredentialVerificationPayload: UserCredentialVerificationPayload): Promise<boolean> {
    const { email, password } = userCredentialVerificationPayload;
    const user = await this.userRepository.getUser({ email });
    const { hashedPassword, salt } = user;
    return isHashedPasswordCorrect({
      hashedPassword,
      salt,
      password
    });
  }
}
