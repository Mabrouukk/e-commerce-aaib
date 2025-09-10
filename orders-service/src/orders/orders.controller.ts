// src/orders/orders.controller.ts
import { Controller, Post, Body, BadRequestException, Headers } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { Order } from './entities/order.entities';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  async create(
    @Body() createOrderDto: CreateOrderDto,
    @Headers('authorization') authHeader: string, 
  ): Promise<Order> {
    try {
      return await this.ordersService.createOrder(createOrderDto, authHeader);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
