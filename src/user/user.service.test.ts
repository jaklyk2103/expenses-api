import UserService from './user.service';
import UserRepository from './user.repository';
import { RegisterUserPayload } from './types/user.types';

jest.mock('./user.repository');

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
});