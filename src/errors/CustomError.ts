export class CustomError extends Error {
  statusCode: number;
  options?: Record<string, unknown>;

  constructor(
    message: string,
    statusCode = 500,
    options?: Record<string, unknown>,
  ) {
    super(message);
    this.statusCode = statusCode;
    this.name = "CustomError";
    this.options = options;
  }
}
