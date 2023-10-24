import { Decimal } from '@prisma/client/runtime/library';
import { IsNotEmpty, IsOptional, IsNumber, IsString, IsUrl } from 'class-validator';

/**
 * Represents the request body for creating a new product.
 */
export class CreateProductBody {
    @IsNotEmpty()
    name: string;
    @IsNotEmpty()
    sku: string;
    @IsNotEmpty()
    description: string;
    @IsNotEmpty()
    price: Decimal;
    @IsOptional()
    @IsNumber()
    weight?: number;
    @IsOptional()
    @IsNumber()
    width?: number;
    @IsOptional()
    @IsNumber()
    length?: number;
    @IsOptional()
    @IsNumber()
    height?: number;
    @IsOptional()
    image: string;
    @IsNotEmpty()
    userId: string;
    @IsOptional()
    @IsString()
    categoryId?: string;
}
