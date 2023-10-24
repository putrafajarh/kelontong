import {
    JsonController,
    OnUndefined,
    QueryParam,
    UseBefore,
    Body,
    Req,
    Res,
    Get,
    Delete,
    Post,
    UploadedFile,
    HttpError,
} from 'routing-controllers';
import { Request, Response } from 'express';
import { Product } from "@prisma/client";
import { ProductNotFoundError } from '../errors/ProductNotFoundError';
import prisma from '../prisma';
import { CreateProductBody } from './request/ProductRequest';
import { PrismaClientKnownRequestError, PrismaClientUnknownRequestError } from '@prisma/client/runtime/library';
import { AuthMiddleware } from '../middlewares/AuthMiddleware';
import { Express } from 'express';
import bodyParser from 'body-parser';
import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import { validateOrReject } from 'class-validator';

const fileUploadOptions = {
    storage: multer.diskStorage({
        destination: (req: any, file: any, cb: any) => {
            cb(null, path.join(__dirname, '../../public', 'uploads'));
        },
        filename: (req: any, file: any, cb: any) => {
            const filename = uuidv4() + path.extname(file.originalname);
            cb(null, filename); 
        }
    }),
    fileFilter: (req: any, file: any, cb: any) => {
        // Allow only JPG and PNG files
        if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
            cb(null, true);
        } else {
            cb(new HttpError(400, "Only JPG and PNG files are allowed"), false);
        }
    },
    limits: {
        fieldNameSize: 255,
        fileSize: 1024 * 1024 * 2
    }
};

@JsonController('/product')
export class ProductController {

    @Get('/')
    @UseBefore(AuthMiddleware)
    public async getProducts(
        @QueryParam('page') page: number = 1,
        @QueryParam('per_page') perPage: number = 20,
        @Req() req: Request,
        @Res() res: Response): Promise<any> {

            if (page < 1) {
                // If page is less than 1, set it to 1
                page = 1;
            }

            if (perPage < 10 || perPage > 100) {
                // Limit perPage to 10 - 100, default to 20
                perPage = 20;
            }

            const products = await prisma.product.findMany({
                orderBy: [
                    {
                        createdAt: 'desc'
                    }
                ],
                skip: (page - 1) * perPage,
                take: perPage,
                include: {
                    user: true,
                    category: true,
                }
            });

            const totalCount = await prisma.product.count();
            const lastPage = Math.ceil(totalCount / perPage);

            res.header("Access-Control-Expose-Headers", "*")
            res.set('X-Total-Count', totalCount.toString());
            res.set('X-Current-Page', page.toString());
            res.set('X-Per-Page', perPage.toString());
            res.set('X-Last-Page', lastPage.toString());

            return res.send(products);
    }

    // @Body({ validate: true, required: true }) body: CreateProductBody,
    // @UploadedFile('image') file: Express.Multer.File, @Body({ validate: true, required: true }) 
    // @UseBefore(multer(fileUploadOptions()).single('image'))

    @Post('/')
    public async createProduct(
        @Body({ validate: false}) body: CreateProductBody,
        @UploadedFile('image', { options: fileUploadOptions }) file: Express.Multer.File,
        @Req() req: Request,
        @Res() res: Response): Promise<any> {
        try {
            await validateOrReject(body, { validationError: { target: false } })
            
            const product = await prisma.product.create({
                data: {
                    name: body.name,
                    sku: body.sku,
                    description: body.description,
                    price: body.price,
                    userId: body.userId,
                    categoryId: body.categoryId,
                    weight: body.weight,
                    length: body.length,
                    width: body.width,
                    height: body.height,
                    image: `http://localhost:5173/uploads/${file.filename}`,
                }
            });
            return res.send(product);
        } catch (e) {
            // Delete uploaded file if an error occurs
            if (file) {
                fs.unlink(file.path, (err) => {
                    if (err) {
                        console.error(err);
                    }
                });
            }

            if (e instanceof PrismaClientKnownRequestError) {
                if (e.code === 'P2002') {
                    return res.status(400).send({
                        name: 'SKUAlreadyExistsError',
                        message: 'SKU already exists',
                    });
                }
                if (e.code === 'P2003') {
                    return res.status(400).send({
                        name: 'UserNotFoundError',
                        message: 'userId not found',
                    });
                }
            }
            console.error(e)
            throw e;
        }
    }

    @Get('/:id')
    @OnUndefined(ProductNotFoundError)
    public async getProduct(@Req() req: Request, @Res() res: Response): Promise<any> {
        const product = await prisma.product.findUnique({
            where: {
                id: req.params.id,
            },
            include: {
                category: true,
            }
        });

        if (!product) {
            throw new ProductNotFoundError();
        }

        return res.send(product);
    }

    @Delete('/:id')
    @OnUndefined(ProductNotFoundError)
    public async deleteProduct(@Req() req: Request, @Res() res: Response): Promise<any> {
        try {
            const product = await prisma.product.delete({
                where: {
                    id: req.params.id,
                },
            });

            return res.send(product);
        } catch (e) {
            if (e instanceof PrismaClientKnownRequestError) {
                if (e.code === 'P2025') {
                    return res.status(404).send({
                        name: e.name,
                        message: 'Product not found',
                        errors: e.meta
                    });
                }
            }
            throw e;
        }
    }
}
