import {BadRequestError, CustomError, HttpError, UnauthorizedError} from '@iot-platforms/core/errors';
import {ArgumentsHost, BadRequestException, Catch, ExceptionFilter, HttpException, UnauthorizedException} from '@nestjs/common';
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

    const res = exception.getResponse() as {message: string}
    if(exception instanceof BadRequestException) {
      error = new BadRequestError(res.message)
    }

    if(exception instanceof UnauthorizedException) {
      error = new UnauthorizedError(res.message)
    }

    this.logger.error(exception.message, exception.getResponse())

    response
      .status(error.statusCode)
      .json(error.toJson());
  }
}
