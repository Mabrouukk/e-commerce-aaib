import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { CreateProductInput } from './dto/product.input';

@Injectable()
export class ProductsService {
  private readonly productServiceUrl = process.env.PRODUCT_SERVICE_URL || 'http://localhost:3001'; // Corrected to port 3001

  constructor(private readonly httpService: HttpService) {}

  async getAllProducts() {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.productServiceUrl}/products`)
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response?.data?.message || 'Failed to fetch products',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getProductById(id: string) {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.productServiceUrl}/products/${id}`)
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response?.data?.message || 'Product not found',
        error.response?.status || HttpStatus.NOT_FOUND
      );
    }
  }

  async createProduct(createProductInput: CreateProductInput) {
    try {
      const response = await firstValueFrom(
        this.httpService.post(`${this.productServiceUrl}/products`, createProductInput)
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response?.data?.message || 'Failed to create product',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}