// src/app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersModule } from './orders/orders.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'ecom_user',
      password: 'ecom_pass',
      database: 'ecom_db',
      autoLoadEntities: true,
      synchronize: true,
    }),
    OrdersModule, 
  ],
})
export class AppModule {}
