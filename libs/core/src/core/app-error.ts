import {UseCaseCode, UseCaseError} from "./use-case.error";

export namespace AppError {
  export class UnexpectedError extends UseCaseError {
    public constructor (err: any) {
      super({
        message: 'An unexpected error occurred.',
        status: UseCaseCode.Unexpected,
        error: UnexpectedError.name,
      }, err)
    }

    public static create (err: any): UnexpectedError {
      return new UnexpectedError(err);
    }
  }
}
