import { IServerError } from "../general/server";

export interface IValidationError {
  fields: Record<string, string>;
  type: "validation";
  message?: string;
}

export interface ISuccess {
  redirectTo: string;
  type: "success";
  message?: string;
}

export type TState = IValidationError | IServerError | ISuccess | null;
