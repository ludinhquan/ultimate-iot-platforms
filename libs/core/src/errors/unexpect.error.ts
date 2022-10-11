import {CustomError} from "./custom.error";

export class UnexpectedError extends CustomError {
  statusCode = 500;

  constructor(message?: string) {
    super(message ?? 'An unexpected error occurred');

    Object.setPrototypeOf(this, UnexpectedError.prototype);
  }

  serializeErrors() {
    return [{message: 'An unexpected error occurred.'}];
  }
}
