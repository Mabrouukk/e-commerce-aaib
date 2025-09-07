import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { UsersResolver } from './ users.resolver';

@Module({
  imports: [HttpModule],
  providers: [UsersResolver],
})
export class UsersModule {}