import { Resolver, Query, Args } from '@nestjs/graphql';
import { HttpService } from '@nestjs/axios';
import { User } from './models/user.model';
import { firstValueFrom } from 'rxjs';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly httpService: HttpService) {}

  @Query(() => [User], { description: 'Get all users' })
  async users(): Promise<User[]> {
    try {
      const response = await firstValueFrom(
        this.httpService.get('http://localhost:3000/users')
      );
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch users from user service');
    }
  }

  @Query(() => User, { 
    description: 'Get a user by ID',
    nullable: true 
  })
  async user(
    @Args('id', { type: () => String }) id: string
  ): Promise<User | null> {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`http://localhost:3000/users/${id}`)
      );
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        return null;
      }
      throw new Error('Failed to fetch user from user service');
    }
  }
}