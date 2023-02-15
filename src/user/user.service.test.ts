import UserService from './user.service';
import UserRepository from './user.repository';
import { DeleteUserPayload, LoginUserPayload, LogoutUserPayload, RegisterUserPayload } from './types/user.types';
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

    describe('deleteUser method', () => {
      it('Should delete user', async () => {
        const deleteUserMock = jest.fn();
        const getUserMock = jest.fn().mockImplementation(() => ({
          hashedPassword: 'test-hashed-password',
          salt: 'test-salt'
        }));
        UserRepository.prototype.deleteUser = deleteUserMock;
        UserRepository.prototype.getUser = getUserMock;
  
        const userRepository = new (UserRepository as jest.Mock)();
        const userService = new UserService(userRepository);
  
        const payload: DeleteUserPayload = {
          email: 'test-email',
          password: 'test-password'
        };
        await userService.deleteUser(payload);
  
        expect(deleteUserMock.mock.calls).toHaveLength(1);
      });
  
      it('Should throw UserCredentialsIncorrect error when user passes incorrect credentials', async () => {
        mockIsHashedPasswordCorrect.mockImplementationOnce(() => false);
  
        const deleteUserMock = jest.fn();
        const getUserMock = jest.fn().mockImplementation(() => ({
          hashedPassword: 'test-hashed-password',
          salt: 'test-salt'
        }));
        UserRepository.prototype.deleteUser = deleteUserMock;
        UserRepository.prototype.getUser = getUserMock;
  
        const userRepository = new (UserRepository as jest.Mock)();
        const userService = new UserService(userRepository);
  
        const payload: DeleteUserPayload = {
          email: 'test-email',
          password: 'test-password'
        };
        
        expect(async () => {await userService.deleteUser(payload);}).rejects.toThrowErrorMatchingInlineSnapshot(`"Users credentials incorrect."`);
      });
    });

    describe('logOutUser method', () => {
      it('Should log out user', async () => {
        const deleteUserTokenSpy = jest.fn();
        UserRepository.prototype.deleteUserToken = deleteUserTokenSpy;
  
        const userRepository = new (UserRepository as jest.Mock)();
        const userService = new UserService(userRepository);
  
        const payload: LogoutUserPayload = {
          email: 'test-email'
        }
        await userService.logoutUser(payload);
  
        expect(deleteUserTokenSpy.mock.calls).toHaveLength(1);
        expect(deleteUserTokenSpy.mock.calls[0][0]).toMatchObject(payload)
      });
    });
  });
});