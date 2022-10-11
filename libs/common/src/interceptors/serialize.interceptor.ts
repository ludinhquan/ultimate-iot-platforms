import {CallHandler, ExecutionContext, Injectable, NestInterceptor, UseInterceptors} from '@nestjs/common';
import {plainToInstance} from 'class-transformer';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

export function Serialize(dto: ClassType) {
  return UseInterceptors(new SerializeInterceptor(dto));
}

@Injectable()
export class SerializeInterceptor implements NestInterceptor {
  constructor(private dto: any) {}

  intercept(_: ExecutionContext, handler: CallHandler): Observable<any> {
    return handler.handle().pipe(
      map((data: any) => {
        return plainToInstance(this.dto, data, {
          excludeExtraneousValues: true,
        });
      })
    );
  }
}
