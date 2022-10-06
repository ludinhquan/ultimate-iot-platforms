import {HttpErrors} from "@iot-platforms/core/core/error";
import {CallHandler, ExecutionContext, HttpException, Injectable, NestInterceptor} from "@nestjs/common";
import {catchError, Observable} from "rxjs";

@Injectable()
export class ErrorsInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next
      .handle()
      .pipe(
        catchError((err: unknown) => {
          if(err instanceof HttpErrors) {
            throw new HttpException(err.message, err.status)
          }
          throw err
        }),
      );
  }
}
