
import { IsInt, Min, ArrayNotEmpty, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class OrderItemDto {
  @IsInt()
  productId: number;

  @IsInt()
  @Min(1)
  quantity: number;
}

export class CreateOrderDto {
  @IsInt()
  @Min(1)
  userId: number;

  
  items: { productId: string; quantity: number }[];
}
