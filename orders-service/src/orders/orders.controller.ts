// src/orders/orders.controller.ts
import { Controller, Post, Body, BadRequestException, Headers,Get } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { Order } from './entities/order.entities';
import { Param } from '@nestjs/common';


@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}
  @Get()
  async findAll(): Promise<Order[]> {
    return this.ordersService.getAllOrders();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Order> {
    return this.ordersService.getOrderById(parseInt(id));
  }

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
