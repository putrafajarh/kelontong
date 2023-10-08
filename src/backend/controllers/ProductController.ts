import { JsonController, Req, Res, Get, OnUndefined } from 'routing-controllers';
import { ProductNotFoundError } from '../errors/ProductNotFoundError';
import prisma from '../prisma';

@JsonController('/product')
export class ProductController {

    @Get('/')
    public async getProducts(@Req() req: any, @Res() res: any): Promise<any> {
        const products = await prisma.product.findMany();

        return res.send(products);
    }

    @Get('/:id')
    @OnUndefined(ProductNotFoundError)
    public async getProduct(@Req() req: any, @Res() res: any): Promise<any> {
        const product = await prisma.product.findUnique({
            where: {
                id: req.params.id,
            },
        });

        if (!product) {
            throw new ProductNotFoundError();
        }

        return res.send(product);
    }
}
