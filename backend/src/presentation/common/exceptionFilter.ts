import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpStatus,
    BadRequestException,
    ForbiddenException,
} from '@nestjs/common';
import { Response } from 'express';
import { AppError, AuthorityError, BadValueError, LinksCycleError, NotFoundError, UniqueError } from '../../domain/common/domainErrors';


@Catch()
export class AppExceptionFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();

        if (exception instanceof AppError) {
            const { status, message } = this.mapError(exception);

            return response.status(status).json({
                statusCode: status,
                message,
                error: exception.constructor.name,
            });
        }
        if(exception instanceof BadRequestException){
            return response.status(HttpStatus.BAD_REQUEST).json({
                statusCode: 400,
                message: 'Bad request',
            })
        }
        if(exception instanceof ForbiddenException){
            return response.status(HttpStatus.FORBIDDEN).json({
                statusCode: 403,
                message: 'Forbidden',
            })
        }
        // fallback (не доменные ошибки)
        console.error(exception);
        return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            statusCode: 500,
            message: 'Internal server error',
        });
    }

    private mapError(error: AppError): {
        status: number;
        message: string;
    } {
        if (error instanceof NotFoundError) {
            return { status: HttpStatus.NOT_FOUND, message: error.message };
        }

        if (error instanceof AuthorityError) {
            return { status: HttpStatus.FORBIDDEN, message: error.message };
        }

        if (error instanceof BadValueError) {
            return { status: HttpStatus.BAD_REQUEST, message: error.message };
        }

        if (error instanceof UniqueError) {
            return { status: HttpStatus.CONFLICT, message: error.message };
        }

        if (error instanceof LinksCycleError) {
            return { status: HttpStatus.CONFLICT, message: error.message };
        }

        // дефолт для AppError
        return {
            status: HttpStatus.BAD_REQUEST,
            message: error.message,
        };
    }
}