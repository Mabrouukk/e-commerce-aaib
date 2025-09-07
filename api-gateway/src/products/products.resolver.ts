import { Resolver, Query, Args } from '@nestjs/graphql';
import { HttpService } from '@nestjs/axios';
import { Product } from '../users/models/product.model';
import { firstValueFrom } from 'rxjs';

@Resolver(() => Product)
export class ProductsResolver {
  constructor(private readonly httpService: HttpService) {
    console.log('ProductsResolver instantiated');
  }

  @Query(() => [Product], { description: 'Get all products' })
  async products(): Promise<Product[]> {
    try {
      console.log('Making request to http://localhost:3001/products...');
      const response = await firstValueFrom(
        this.httpService.get('http://localhost:3001/products')
      );
      console.log('Response received:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error details:');
      console.error('- Message:', error.message);
      console.error('- Code:', error.code);
      console.error('- Response status:', error.response?.status);
      console.error('- Response data:', error.response?.data);
      
      if (error.code === 'ECONNREFUSED') {
        throw new Error('Cannot connect to product service on port 3001. Is it running?');
      }
      
      throw new Error(`Failed to fetch products: ${error.message}`);
    }
  }

  @Query(() => Product, { 
    description: 'Get a product by ID',
    nullable: true 
  })
  async product(
    @Args('id', { type: () => String }) id: string
  ): Promise<Product | null> {
    try {
      console.log(`Making request to http://localhost:3001/products/${id}...`);
      const response = await firstValueFrom(
        this.httpService.get(`http://localhost:3001/products/${id}`)
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching product:', error.message);
      
      if (error.response?.status === 404) {
        return null;
      }
      if (error.code === 'ECONNREFUSED') {
        throw new Error('Cannot connect to product service on port 3001. Is it running?');
      }
      
      throw new Error(`Failed to fetch product: ${error.message}`);
    }
  }
}