import {CustomError} from "./custom.error";

export class BadRequestError extends CustomError {
  statusCode = 400;

  constructor(public message: string | string[]) {
    super('Bad Request');

    Object.setPrototypeOf(this, BadRequestError.prototype);
  }

  serializeErrors() {
    const errors = typeof this.message === 'string' ? [this.message] : this.message 
    return errors.map(error => ({message: error}))
  }
}
