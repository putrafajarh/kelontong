import { JsonController, Req, Res, Get } from 'routing-controllers';
import { ProductNotFoundError } from '../errors/ProductNotFoundError';

@JsonController('/product')
export class ProductController {

    @Get('/')
    public getProducts(@Req() req: any, @Res() res: any): Promise<any> {
        const products = [
            { id: 1, name: 'Product 1', price: 10.99 },
            { id: 2, name: 'Product 2', price: 20.99 },
            { id: 3, name: 'Product 3', price: 30.99 },
        ];

        return res.send(products);
    }
}
