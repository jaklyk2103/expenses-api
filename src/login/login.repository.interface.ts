export default interface ILoginRepository {
  getUserToken(email: string): Promise<string>;
  updateUserToken(email: string): Promise<void>;
  deleteUserToken(): Promise<void>;
  registerUser(): Promise<void>;
}