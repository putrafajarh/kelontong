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
    Post
} from 'routing-controllers';
import { Request, Response } from 'express';
import { Product } from "@prisma/client";
import { ProductNotFoundError } from '../errors/ProductNotFoundError';
import prisma from '../prisma';
import { CreateProductBody } from './request/ProductRequest';
import { PrismaClientKnownRequestError, PrismaClientUnknownRequestError } from '@prisma/client/runtime/library';
import { AuthMiddleware } from '../middlewares/AuthMiddleware';

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

    @Post('/')
    public async createProduct(@Body({ validate: true, required: true }) body: CreateProductBody, @Req() req: Request, @Res() res: Response): Promise<any> {
        try {
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
                    image: body.image,
                }
            });
            return res.send(product);
        } catch (e) {
            if (e instanceof PrismaClientKnownRequestError) {
                if (e.code === 'P2002') {
                    return res.status(400).send({
                        name: e.name,
                        message: 'SKU already exists',
                        errors: e.meta
                    });
                }
            }
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
