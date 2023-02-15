export type LoginUserPayload = {
  email: string,
  password: string
};

export type LogoutUserPayload = {
  email: string
}

export type UpdateUserTokenPayload = {
  email: string
};

export type RegisterUserPayload = {
  email: string,
  password: string
}

export type UserCredentialVerificationPayload = {
  email: string,
  password: string
};

export type User = {
  email: string,
  hashedPassword: string,
  salt: string,
  sessionToken: string,
  sessionTokenValidityTimestampMsUtc: string
};