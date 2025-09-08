import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { User, AuthPayload } from './models/user.model';
import { CreateUserInput, LoginInput } from './models/dto/user.input';
import { UsersService } from './users.service';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Mutation(() => User, { description: 'Register a new user' })
  async registerUser(
    @Args('createUserInput') createUserInput: CreateUserInput
  ): Promise<User> {
    return this.usersService.createUser(createUserInput);
  }

  @Mutation(() => AuthPayload, { description: 'Login user and return token' })
  async login(
    @Args('loginInput') loginInput: LoginInput
  ): Promise<AuthPayload> {
    return this.usersService.login(loginInput);
  }

  @Query(() => User, { description: 'Get user by ID' })
  async user(
    @Args('id') id: string,
    @Context() context: any
  ): Promise<User> {
    const token = this.extractTokenFromContext(context);
    if (!token) throw new Error('Authentication token required');
    return this.usersService.getUserById(id, token);
  }

  @Query(() => [User], { description: 'Get all users (requires authentication)' })
  async users(@Context() context: any): Promise<User[]> {
    const token = this.extractTokenFromContext(context);
    if (!token) throw new Error('Authentication token required');
    return this.usersService.getAllUsers(token);
  }

  private extractTokenFromContext(context: any): string | undefined {
    const authHeader = context.req?.headers?.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      return authHeader.substring(7);
    }
    return undefined;
  }
}