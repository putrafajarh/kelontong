import 'reflect-metadata';
import { Application, urlencoded } from 'express';
import { createExpressServer } from 'routing-controllers';
import path from 'path';
import * as dotenv from 'dotenv';

dotenv.config({
    path: path.join(__dirname, "../../.env"),
})

const app: Application = createExpressServer({
    cors: true,
    classTransformer: true,
    routePrefix: "/api",
    defaultErrorHandler: false,
    controllers: [path.join(__dirname, "/controllers/*.js")],
    middlewares: [path.join(__dirname, "/middlewares/*.js")],
    interceptors: [path.join(__dirname, "/interceptors/*.js")],
});

app.use(urlencoded({extended: true}))

const port = process.env.APP_PORT || 2000;
app.listen(port, () => {
    console.log(`[server] Server started on port ${port}`);
});