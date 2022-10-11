import {Logger} from "@iot-platforms/common";

export enum UseCaseCode {
  NotFound = 404,
  BadRequest = 422,

  Unexpected = 500
}

interface IUseCaseError {
  message: string;
  error: string,
  status: number
}

export abstract class UseCaseError implements IUseCaseError {
  logger = new Logger(UseCaseError.name)

  public readonly message: string;
  public readonly error: string;
  public readonly status: number;
  public readonly description: any;
  
  constructor (params: IUseCaseError, error?: any) {
    this.status = params.status;
    this.error = params.error;
    this.message = params.message;

    if(!global.isDevelopment) return

    this.logger.error(error, error?.stack)

    this.description = error ? {desc: error?.message, stack: error?.stack} : undefined
  }
}
