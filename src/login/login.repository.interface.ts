export default interface ILoginRepository {
  getUserToken(email: string): Promise<string>;
  updateUserToken(): Promise<void>;
  deleteUserToken(): Promise<void>;
  registerUser(): Promise<void>;
}