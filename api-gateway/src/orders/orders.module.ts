import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { OrdersService } from './orders.service';
import { OrdersResolver } from './orders.resolver';

@Module({
  imports: [HttpModule],
  providers: [OrdersService, OrdersResolver],
  exports: [OrdersService],
})
export class OrdersModule {}
