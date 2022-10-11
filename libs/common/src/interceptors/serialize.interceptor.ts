import {UseCaseError} from '@iot-platforms/core';
import {
  CallHandler, ExecutionContext, Injectable, NestInterceptor, UseInterceptors
} from '@nestjs/common';
import {plainToInstance} from 'class-transformer';
import {Request, Response} from 'express';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

interface ClassConstructor {
  new (...args: any[]): {};
}

export function Serialize(dto: ClassConstructor) {
  return UseInterceptors(new SerializeInterceptor(dto));
}

@Injectable()
export class SerializeInterceptor implements NestInterceptor {
  constructor(private dto?: any) {}

  intercept(context: ExecutionContext, handler: CallHandler): Observable<any> {
    return handler.handle().pipe(
      map((data: any) => {
        const ctx = context.switchToHttp()
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        if(data instanceof UseCaseError) {
          response
            .status(data.status)
            .json({
              status: data.status,
              error: data.error,
              message: data.message,
              description: data.description,
              timestamp: new Date().toISOString(),
              path: request.url,
            });
          return
        }

        return plainToInstance(this.dto, data, {
          excludeExtraneousValues: true,
        });
      }),
    );
  }
}
