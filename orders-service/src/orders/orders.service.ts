// src/orders/orders.service.ts
import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { firstValueFrom } from 'rxjs';
import { Order } from './entities/order.entities';
import { OrderItem } from './entities/order-item.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>, 
    @InjectRepository(OrderItem)
    private orderItemRepository: Repository<OrderItem>,
    private readonly httpService: HttpService,
    private readonly dataSource: DataSource,
  ) {}
  async getAllOrders (): Promise<Order[]> {
    return this.orderRepository.find({ relations: ['items'] });
  }

  async getOrderById(id: number): Promise<Order> {
    const order = await this.orderRepository.findOne({ 
      where: { id }, 
      relations: ['items'] 
    });
    
    if (!order) {
      throw new BadRequestException(`Order with ID ${id} not found`);
    }
    
    return order;
  }
  async createOrder(createOrderDto: CreateOrderDto, authHeader: string): Promise<Order> {
  const { userId, items } = createOrderDto;
  const userServiceUrl = process.env.USER_SERVICE_URL || 'http://localhost:3000';
  const productServiceUrl = process.env.PRODUCT_SERVICE_URL || 'http://localhost:3001';

  try {
    const userResponse = await firstValueFrom(
      this.httpService.get(`${userServiceUrl}/users/${userId}`, {
        headers: { Authorization: authHeader }, 
      }),
    );

    if (!userResponse.data) {
      throw new BadRequestException('User not found');
    }
  } catch (error) {
    console.error('User validation error:', error.response?.data || error.message);
    throw new BadRequestException('Failed to validate user');
  }

    let total = 0;
    const orderItems: OrderItem[] = [];
    for (const item of items) {
  try {
    const productResponse = await firstValueFrom(
      this.httpService.get(`${productServiceUrl}/products/${item.productId}`),
    );
    const product = productResponse.data;

    if (!product) {
      throw new BadRequestException(`Product ${item.productId} not found`);
    }

    // Convert stock from string to number
    const stock = Number(product.stock);
    if (isNaN(stock) || stock < item.quantity) {
      throw new BadRequestException(`Insufficient stock for product ${item.productId}`);
    }

    const orderItem = new OrderItem();
    orderItem.productId = product._id;   // Mongo string ID
    orderItem.quantity = item.quantity;
    orderItem.price = product.price;
    orderItems.push(orderItem);

    total += product.price * item.quantity;
  } catch (error) {
    throw new BadRequestException(`Failed to validate product ${item.productId}`);
  }
}


    // Step 3: Save order + order items in a transaction
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const order = new Order();
      order.userId = userId;
      order.total = total;
      order.status = 'pending';
      order.items = orderItems;

      const savedOrder = await queryRunner.manager.save(Order, order);
      await queryRunner.commitTransaction();
      return savedOrder;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new BadRequestException('Failed to create order');
    } finally {
      await queryRunner.release();
    }
  }
}
