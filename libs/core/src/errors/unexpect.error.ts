import {CustomError} from "./custom.error";

export class UnexpectedError extends CustomError {
  statusCode = 500;

  constructor(message?: string, public stack?: string) {
    super(message ?? 'An unexpected error occurred');

    Object.setPrototypeOf(this, UnexpectedError.prototype);
  }

  serializeErrors() {
    const error: {message: string, detail?: string} = {message: this.message}
    if (global.isDevelopment) error.detail = this.stack
    return [error];
  }
}
