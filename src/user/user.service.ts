import IUserRepository from './user.repository.interface';
import { DeleteUserPayload, LoginUserPayload, LogoutUserPayload, RegisterUserPayload, UserCredentialVerificationPayload, VerifyUserAuthenticityPayload } from './types/user.types';
import { isHashedPasswordCorrect } from '../shared/cryptoUtils';

export default class UserService {
  private userRepository: IUserRepository;

  constructor(userRepository: IUserRepository) {
    this.userRepository = userRepository;
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

  async isUserAuthentic(verifyUserAuthenticityPayload: VerifyUserAuthenticityPayload): Promise<boolean> {
    const { email, userSessionToken } = verifyUserAuthenticityPayload;

    try {
      const user = await this.userRepository.getUser({
        email
      });
      
      const isTokenFromPayloadValid = userSessionToken === user.sessionToken;
      const isTokenExpired = this.isUserSessionTokenExpired(Number(user.sessionTokenExpiryTimestampMsUtc));
      
      return isTokenFromPayloadValid && !isTokenExpired;
    } catch (error) {
      return false;
    }
  }

  private isUserSessionTokenExpired(sessionTokenExpiryTimestampMsUtc: number): boolean {
    return Date.now() > sessionTokenExpiryTimestampMsUtc;
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
