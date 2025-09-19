import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class CreateOrderItemInput {
  @Field()
  productId: string;

  @Field(() => Int)
  quantity: number;
}

@InputType()
export class CreateOrderInput {
  @Field(() => Int)
  userId: number;

  @Field(() => [CreateOrderItemInput])
  items: CreateOrderItemInput[];
}
