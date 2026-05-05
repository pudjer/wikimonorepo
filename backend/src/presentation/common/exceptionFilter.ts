import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { AppError, AuthorityError, BadValueError, LinksCycleError, NotFoundError, UnauthorizedError, UniqueError } from '../../domain/common/domainErrors';


@Catch()
export class AppExceptionFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        console.error(exception);
    
        if (exception instanceof AppError) {
            const { status, message } = this.mapError(exception);
            return response.status(status).json({
                statusCode: status,
                message,
                error: exception.constructor.name,
            });
        }
    
        // Маппинг известных HTTP-исключений
        const httpExceptionMap: Record<string, { status: number; message: string }> = {
            NotFoundException: { status: 404, message: 'Not found' },
            UnauthorizedException: { status: 401, message: 'Unauthorized' },
            BadRequestException: { status: 400, message: 'Bad request' },
            ForbiddenException: { status: 403, message: 'Forbidden' },
        };
    
        const exceptionName = exception?.constructor?.name;
        const mappedError = exceptionName && httpExceptionMap[exceptionName];
    
        if (mappedError) {
            return response.status(mappedError.status).json({
                statusCode: mappedError.status,
                message: mappedError.message,
            });
        }
    
        // Fallback
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

        if (error instanceof UnauthorizedError) {
            return { status: HttpStatus.UNAUTHORIZED, message: error.message };
        }

        // дефолт для AppError
        return {
            status: HttpStatus.BAD_REQUEST,
            message: error.message,
        };
    }
}