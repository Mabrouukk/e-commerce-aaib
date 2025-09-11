import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { CreateOrderInput } from './dto/create-order.input';

@Injectable()
export class OrdersService {
  private readonly ordersServiceUrl =
    process.env.ORDERS_SERVICE_URL || 'http://localhost:3003';

  constructor(private readonly httpService: HttpService) {}

  async createOrder(input: CreateOrderInput) {
    try {
      const response = await firstValueFrom(
        this.httpService.post(`${this.ordersServiceUrl}/orders`, input, {
          headers: { 'Content-Type': 'application/json' },
        }),
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response?.data?.message || 'Failed to create order',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getOrderById(id: number) {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.ordersServiceUrl}/orders/${id}`),
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response?.data?.message || 'Order not found',
        error.response?.status || HttpStatus.NOT_FOUND,
      );
    }
  }

  async getAllOrders() {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.ordersServiceUrl}/orders`),
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response?.data?.message || 'Failed to fetch orders',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
