import {CustomError} from "./custom.error";

export class NotAuthorizedError extends CustomError {
  statusCode = 401;

  constructor(message: string) {
    super(message);
  }

  serializeErrors() {
    return [{message: 'Not authorized'}];
  }
}
