import 'reflect-metadata';
import { Request, Response, Application } from 'express';
import { createExpressServer } from 'routing-controllers';
import { ProductController } from './controllers/ProductController';
import path from 'path';

console.log(path.join(__dirname, "/controllers/*.ts"));

const app: Application = createExpressServer({
    cors: true,
    classTransformer: true,
    routePrefix: "/api",
    defaultErrorHandler: false,
    controllers: [path.join(__dirname, "/controllers/*.js")],
    middlewares: [path.join(__dirname, "/middlewares/*.js")],
    interceptors: [path.join(__dirname, "/interceptors/*.js")],
});

app.listen(8000, () => {
    console.log("Server started on port 8000");
});