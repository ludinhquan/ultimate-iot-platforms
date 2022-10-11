import {Logger} from "@iot-platforms/common";

export class Result<T> {
  private logger = new Logger(this.constructor.name)

  private readonly _isSuccess: boolean;
  private readonly _isFailure: boolean
  private readonly error: T | string;
  private readonly value: T;

  public constructor (isSuccess: boolean, error?: T | string, value?: T) {
    if (isSuccess && error) {
      throw new Error("InvalidOperation: A result cannot be successful and contain an error");
    }
    if (!isSuccess && !error) {
      throw new Error("InvalidOperation: A failing result needs to contain an error message");
    }

    this._isSuccess = isSuccess;
    this._isFailure = !isSuccess;
    this.error = error;
    this.value = value;
    
    Object.freeze(this);
  }

  get isSuccess(){
    return this._isSuccess
  }

  get isFailure(){
    return this._isFailure
  }

  public getValue () : T {
    if (!this._isSuccess) {
      this.logger.error(this.error);
      throw new Error("Can't get the value of an error result. Use 'errorValue' instead.")
    } 

    return this.value;
  }

  public getError<K = T>(): K {
    return this.error as K;
  }

  public static ok<U> (value?: U) : Result<U> {
    return new Result<U>(true, null, value);
  }

  public static fail<U> (error: string|any): Result<U> {
    return new Result<U>(false, error);
  }

  public static combine (results: Result<any>[]) : Result<any> {
    for (let result of results) {
      if (result._isFailure) return result;
    }
    return Result.ok();
  }
}

export type Either<L, A> = Left<L, A> | Right<L, A>;

export class Left<L, A> {
  readonly value: L;

  constructor(value: L) {
    this.value = value;
  }

  isLeft(): this is Left<L, A> {
    return true;
  }

  isRight(): this is Right<L, A> {
    return false;
  }
}

export class Right<L, A> {
  readonly value: A;

  constructor(value: A) {
    this.value = value;
  }

  isLeft(): this is Left<L, A> {
    return false;
  }

  isRight(): this is Right<L, A> {
    return true;
  }
}

export const left = <L, A>(l: L): Either<L, A> => {
  return new Left(l);
};

export const right = <L, A>(a: A): Either<L, A> => {
  return new Right<L, A>(a);
};
