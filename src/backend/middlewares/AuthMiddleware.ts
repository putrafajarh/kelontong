import { Request, Response, NextFunction } from 'express';
import { ExpressMiddlewareInterface } from 'routing-controllers';
import { verify } from 'jsonwebtoken';

export class AuthMiddleware implements ExpressMiddlewareInterface {

    public use(req: Request, res: Response, next: NextFunction): void {

        const token = req.headers['x-access-token'];
        const secret = req.headers['x-signature'];

        if (!token) {
            res.status(403).send({
                message: "No token provided!"
            });
        }

        if (!secret) {
            res.status(403).send({
                message: "No signature provided!"
            });
        }

        verify(token, secret, (err: any, decoded: any) => {
            if (err) {
                return res.status(401).send({
                    message: "Unauthorized!"
                });
            }

            const user = {
                id: decoded.id,
                email: decoded.email,
                role: decoded.role
            }
            
            req.user = user
        });

        return next();
    }
}