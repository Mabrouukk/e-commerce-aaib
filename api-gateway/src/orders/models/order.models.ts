import { ObjectType, Field, ID, Int } from '@nestjs/graphql';
import { OrderItem } from './order-item.model';

@ObjectType()
export class Order {
  @Field(() => ID)
  id: number;

  @Field(() => Int)
  userId: number;

  @Field(() => Int)
  total: number;

  @Field()
  status: string;

  @Field(() => [OrderItem])
  items: OrderItem[];

  @Field()
  createdAt: Date;
}
