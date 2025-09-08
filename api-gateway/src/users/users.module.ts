import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { UsersResolver } from './ users.resolver';
import { UsersService } from './users.service';

@Module({
  imports: [HttpModule],
  providers: [UsersResolver, UsersService],
  exports: [UsersService],
})
export class UsersModule {}