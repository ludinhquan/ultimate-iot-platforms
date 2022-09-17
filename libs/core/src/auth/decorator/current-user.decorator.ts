import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import {Request} from 'express';

export const CurrentUser = createParamDecorator(
  (_: unknown, context: ExecutionContext) => {
    const req = context.switchToHttp().getRequest<Request>()
    return req.user;
  },
);
