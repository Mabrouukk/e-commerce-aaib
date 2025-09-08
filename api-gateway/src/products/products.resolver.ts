import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { Product } from './models/product.model';
import { CreateProductInput } from './dto/product.input';
import { ProductsService } from './products.service';

@Resolver(() => Product)
export class ProductsResolver {
  constructor(private readonly productsService: ProductsService) {}

  @Query(() => [Product], { description: 'Get all products' })
  async products(): Promise<Product[]> {
    return this.productsService.getAllProducts();
  }

  @Query(() => Product, { description: 'Get product by ID' })
  async product(@Args('id') id: string): Promise<Product> {
    return this.productsService.getProductById(id);
  }

  @Mutation(() => Product, { description: 'Create a new product' })
  async createProduct(
    @Args('createProductInput') createProductInput: CreateProductInput
  ): Promise<Product> {
    return this.productsService.createProduct(createProductInput);
  }
}