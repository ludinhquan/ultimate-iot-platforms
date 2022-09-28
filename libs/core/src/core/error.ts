export enum HttpExceptionKey {
  NOT_FOUND_EXCEPTION,
  BAD_REQUEST_EXCEPTION,
}

export abstract class HttpErrors {
  abstract code: number
  abstract key: HttpExceptionKey
  message: string

  constructor(message: string) {
    this.message = message
  }
}
