import { TUserId } from "../general";

export type SessionPayload = {
  userId: TUserId;
  expiresAt: Date;
};

export interface ISession {
  isAuth: boolean;
  userId?: TUserId;
}

export type LoginFields = "email" | "password";
export type RegisterFields =
  | "username"
  | "email"
  | "password"
  | "confirmPassword";
