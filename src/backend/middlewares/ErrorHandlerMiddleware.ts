import { ValidationError } from 'class-validator';
import * as express from 'express';
import { ExpressErrorMiddlewareInterface, HttpError, Middleware } from 'routing-controllers';

@Middleware({ type: 'after' })
export class ErrorHandlerMiddleware implements ExpressErrorMiddlewareInterface {

    public isProduction = process.env.NODE_ENV === 'production';

    public error(error: HttpError, req: express.Request, res: express.Response, next: express.NextFunction): void {
        // check if error is array of ValidationError
        if (Array.isArray(error) && error[0] instanceof ValidationError) {
            res.status(error.httpCode || 422);
            res.json({
                name: 'ValidationError',
                message: 'Validation Error',
                errors: error.map((error: ValidationError) => {
                    return {
                        field: error.property,
                        constraints: Object.entries(error.constraints || {}).map(([key, message]) => message)
                    }
                }),
            });
            return
        } else {
            res.status(error.httpCode || 500);
            res.json({
                name: error.name,
                message: error.message,
                errors: error[`errors`] || [],
            });
        }

        // only print the stacktrace to console if not in production mode
        if (this.isProduction) {
            console.error(error.name, error.message);
        } else {
            console.error(error.name, error.stack)
        }
    }
}