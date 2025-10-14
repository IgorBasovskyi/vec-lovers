export interface ICredentials {
  email: string;
  password: string;
}

export interface IRegistrationDetails extends ICredentials {
  username: string;
  confirmPassword: string;
}
