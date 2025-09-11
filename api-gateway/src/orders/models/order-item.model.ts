import { ObjectType, Field, Int, ID } from '@nestjs/graphql';

@ObjectType()
export class OrderItem {
  @Field(() => ID)
  id: number;

  @Field()
  productId: string;

  @Field(() => Int)
  quantity: number;

  @Field(() => Int)
  price: number;
}
