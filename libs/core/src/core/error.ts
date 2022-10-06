export enum Error {
  NOT_FOUND_EXCEPTION,
  BAD_REQUEST_EXCEPTION,
}

export type StatusCode = number

export abstract class HttpErrors {
  message: string
  error: string
  status: StatusCode

  constructor(message: string, statusCode?: StatusCode) {
    this.message = message
    this.error = new.target.name
    this.status = statusCode ?? 500
  }
}
