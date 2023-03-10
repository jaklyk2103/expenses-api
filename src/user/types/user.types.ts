export type LoginUserPayload = {
  email: string,
  password: string
};

export type LogoutUserPayload = {
  email: string
};

export type UpdateUserTokenPayload = {
  email: string
};

export type RegisterUserPayload = {
  email: string,
  password: string
};

export type DeleteUserPayload = {
  email: string,
  password: string
};

export type VerifyUserAuthenticityPayload = {
  email: string,
  userSessionToken: string
};

export type GetUserPayload = {
  email: string
};

export type UserCredentialVerificationPayload = {
  email: string,
  password: string
};

export type User = {
  email: string,
  hashedPassword: string,
  salt: string,
  sessionToken: string,
  sessionTokenExpiryTimestampMsUtc: string
};