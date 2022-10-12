import {BadRequestError, CustomError, HttpError} from '@iot-platforms/core/errors';
import {ArgumentsHost, BadRequestException, Catch, ExceptionFilter, HttpException} from '@nestjs/common';
import {Response} from 'express';
import {Logger} from '../logger';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private logger = new Logger(HttpExceptionFilter.name)

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let error: CustomError = new HttpError(
      exception.message, exception.getStatus()
    )

    if(exception instanceof BadRequestException) {
      const res = exception.getResponse() as {message: string}
      error = new BadRequestError(res.message)
    }

    this.logger.error(exception.message, exception.getResponse())

    response
      .status(error.statusCode)
      .json(error.toJson());
  }
}
