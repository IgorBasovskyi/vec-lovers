export type SessionPayload = {
  userId: string;
  expiresAt: Date;
};

export interface ISession {
  isAuth: boolean;
  userId?: string;
}

export type LoginFields = "email" | "password";
export type RegisterFields =
  | "username"
  | "email"
  | "password"
  | "confirmPassword";
