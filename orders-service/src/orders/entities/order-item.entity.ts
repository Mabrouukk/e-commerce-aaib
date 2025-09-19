
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Order } from './order.entities';

@Entity()
export class OrderItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  productId: string; 
  @Column()
  quantity: number;

  @Column()
  price: number; 

  @ManyToOne(() => Order, (order) => order.items)
  order: Order;
}