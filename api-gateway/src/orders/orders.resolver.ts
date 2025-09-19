import { Resolver, Mutation, Args, Query, Int } from '@nestjs/graphql';
import { OrdersService } from './orders.service';
import { Order } from './models/order.models';
import { CreateOrderInput } from './dto/create-order.input';

@Resolver(() => Order)
export class OrdersResolver {
  constructor(private readonly ordersService: OrdersService) {}

  @Mutation(() => Order, { description: 'Create a new order' })
  async createOrder(
    @Args('createOrderInput') createOrderInput: CreateOrderInput,
  ) {
    return this.ordersService.createOrder(createOrderInput);
  }

  @Query(() => Order, { description: 'Get order by ID' })
  async order(@Args('id', { type: () => Int }) id: number) {
    return this.ordersService.getOrderById(id);
  }

  @Query(() => [Order], { description: 'Get all orders' })
  async orders() {
    return this.ordersService.getAllOrders();
  }
}
