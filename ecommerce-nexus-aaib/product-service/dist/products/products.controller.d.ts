import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductQueryDto } from './dto/product-query.dto';
export declare class ProductsController {
    private readonly productsService;
    constructor(productsService: ProductsService);
    create(createProductDto: CreateProductDto): Promise<import("./schemas/product.schema").Product>;
    findAll(queryDto: ProductQueryDto): Promise<{
        products: import("./schemas/product.schema").Product[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            pages: number;
        };
    }>;
    getCategories(): Promise<string[]>;
    findOne(id: string): Promise<import("./schemas/product.schema").Product>;
    update(id: string, updateProductDto: UpdateProductDto): Promise<import("./schemas/product.schema").Product>;
    remove(id: string): Promise<void>;
    updateStock(id: string, body: {
        quantity: number;
    }): Promise<import("./schemas/product.schema").Product>;
}
