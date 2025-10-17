export interface IServerError {
  message: string;
  type: "error";
}

export interface IValidationError {
  fields: Record<string, string>;
  type: "validation";
  message?: string;
}
