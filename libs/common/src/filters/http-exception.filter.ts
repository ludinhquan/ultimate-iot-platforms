import {BadRequestError} from '@iot-platforms/core/errors/bad-request.error';
import {CustomError} from '@iot-platforms/core/errors/custom.error';
import {UnexpectedError} from '@iot-platforms/core/errors/unexpect.error';
import {ExceptionFilter, Catch, ArgumentsHost, HttpException, BadRequestException} from '@nestjs/common';
import {Response} from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let error: CustomError = new UnexpectedError()

    if(exception instanceof BadRequestException) {
      const response = exception.getResponse() as {message: string}
      error = new BadRequestError(response.message)
    }

    response
      .status(error.statusCode)
      .json(error.toJson());
  }
}
