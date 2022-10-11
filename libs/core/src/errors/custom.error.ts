export abstract class CustomError extends Error {
  abstract statusCode: number;

  constructor(public message: any, protected status: string = new.target.name) {
    super(message);
    Object.setPrototypeOf(this, CustomError.prototype);
  }

  abstract serializeErrors(): { message: string; field?: string }[];

  public toJson(){
    return {
      statusCode: this.statusCode,
      status: this.status,
      timestamp: new Date().toISOString(),
      errors: this.serializeErrors(),
    }
  }
}
