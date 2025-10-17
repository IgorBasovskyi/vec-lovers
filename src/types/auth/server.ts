import { IServerError, IValidationError } from "../general/server";

export interface ISuccess {
  redirectTo: string;
  type: "success";
  message?: string;
}

export type TState = IValidationError | IServerError | ISuccess | null;

export type SessionPayload = {
  userId: string;
  expiresAt: Date;
};

export interface ISession {
  isAuth: boolean;
  userId?: string;
}
