import {CustomError} from '@iot-platforms/core/errors/custom.error';
import {
  CallHandler, ExecutionContext, Injectable, NestInterceptor
} from '@nestjs/common';
import {Request, Response} from 'express';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {Logger} from '../logger';

@Injectable()
export class HttpInterceptor implements NestInterceptor {
  private logger = new Logger(HttpInterceptor.name)

  intercept(context: ExecutionContext, handler: CallHandler): Observable<any> {
    const ctx = context.switchToHttp()
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const now = new Date()

    const {ip, method, originalUrl} = request;
    const userAgent = request.get("user-agent") || "";

    response.on("finish", () => {
      const {statusCode} = response;
      const contentLength = response.get("content-length");

      this.logger.log(
        `${method} ${originalUrl} ${statusCode} ${contentLength} - ${userAgent} ${ip} +${- now.getTime() + new Date().getTime()}ms`,
      );
    });
    
    return handler.handle().pipe(
      map((data: any) => {
        if(data instanceof CustomError) return data.toJson()
        return data
      }),
    );
  }
}
