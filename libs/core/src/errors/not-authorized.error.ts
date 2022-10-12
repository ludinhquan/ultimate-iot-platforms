import {CustomError} from "./custom.error";

export class UnauthorizedError extends CustomError {
  statusCode = 401;
  message = 'Not authorized'

  constructor(message: string) {
    super(message);
    this.message = message

    Object.setPrototypeOf(this, UnauthorizedError.prototype)
  }

  serializeErrors() {
    return [{message: this.message}];
  }
}
