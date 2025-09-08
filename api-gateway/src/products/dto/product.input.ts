import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsPositive, Min } from 'class-validator';

@InputType()
export class CreateProductInput {
  @Field()
  @IsNotEmpty()
  name: string;

  @Field()
  @IsNotEmpty()
  description: string;

  @Field()
  @IsPositive()
  price: number;

  @Field()
  @Min(0)
  stock: number;

  @Field(() => [String])
  tags: string[];

  @Field()
  category: string;
}