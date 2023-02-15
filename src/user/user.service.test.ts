import UserService from './user.service';
import UserRepository from './user.repository';
import { LoginUserPayload, RegisterUserPayload, UpdateUserTokenPayload } from './types/user.types';
import '../shared/cryptoUtils';

const mockIsHashedPasswordCorrect = jest.fn().mockImplementation(() => true);

jest.mock('./user.repository');
jest.mock('../shared/cryptoUtils', () => ({
  isHashedPasswordCorrect: () => mockIsHashedPasswordCorrect()
}));


describe('UserService tests', () => {
  describe('registerUser method', () => {
    it('Should register user', async () => {
      const registerUserSpy = jest.fn();
      UserRepository.prototype.registerUser = registerUserSpy;

      const userRepository = new (UserRepository as jest.Mock)();
      const userService = new UserService(userRepository);

      const payload: RegisterUserPayload = {
        email: 'test-email',
        password: 'test-password'
      }
      await userService.registerUser(payload);

      expect(registerUserSpy.mock.calls).toHaveLength(1);
      expect(registerUserSpy.mock.calls[0][0]).toMatchObject(payload)
    });
  });

  describe('loginUser method', () => {
    it('Should login user', async () => {
      const getUserMock = jest.fn().mockImplementation(() => ({
        hashedPassword: 'test-hashed-password',
        salt: 'test-salt'
      }));
      const updateUserTokenSpy = jest.fn();
      UserRepository.prototype.getUser = getUserMock;
      UserRepository.prototype.updateUserToken = updateUserTokenSpy;

      const userRepository = new (UserRepository as jest.Mock)();
      const userService = new UserService(userRepository);

      const payload: LoginUserPayload = {
        email: 'test-email',
        password: 'test-password'
      };
      await userService.loginUser(payload);

      expect(getUserMock.mock.calls).toHaveLength(1);
      expect(getUserMock.mock.calls[0][0]).toBe('test-email');
      expect(updateUserTokenSpy.mock.calls).toHaveLength(1);
      expect(updateUserTokenSpy.mock.calls[0][0]).toMatchObject(payload);
    });

    it('Should throw UserCredentialsIncorrect error when user passes incorrect credentials', async () => {
      mockIsHashedPasswordCorrect.mockImplementationOnce(() => false);

      const getUserMock = jest.fn().mockImplementation(() => ({
        hashedPassword: 'test-hashed-password',
        salt: 'test-salt'
      }));
      const updateUserTokenSpy = jest.fn();
      UserRepository.prototype.getUser = getUserMock;
      UserRepository.prototype.updateUserToken = updateUserTokenSpy;


      const userRepository = new (UserRepository as jest.Mock)();
      const userService = new UserService(userRepository);

      const payload: LoginUserPayload = {
        email: 'test-email',
        password: 'test-password'
      };
      
      expect(async () => {await userService.loginUser(payload);}).rejects.toThrowErrorMatchingInlineSnapshot(`"Users credentials incorrect."`);
    });
  });
});