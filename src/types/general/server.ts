export interface IServerError {
  message: string;
  type: "error";
}

export interface IValidationError {
  fields: Record<string, string>;
  type: "validation";
  message?: string;
}

export interface ISuccess {
  type: "success";
  message?: string;
}

export type TState =
  | IValidationError
  | IServerError
  | ISuccess
  | null
  | undefined;
