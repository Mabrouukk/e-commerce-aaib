import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { CreateUserInput, LoginInput } from './models/dto/user.input';

@Injectable()
export class UsersService {
  private readonly userServiceUrl = process.env.USER_SERVICE_URL || 'http://localhost:3000';

  constructor(private readonly httpService: HttpService) {}

  async createUser(createUserInput: CreateUserInput) {
    try {
      const response = await firstValueFrom(
        this.httpService.post(`${this.userServiceUrl}/users`, createUserInput)
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response?.data?.message || 'Failed to create user',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async login(loginInput: LoginInput) {
    console.log(`Login attempt to ${this.userServiceUrl}/auth/login with payload:`, JSON.stringify(loginInput));
    try {
      const response = await firstValueFrom(
        this.httpService.post(`${this.userServiceUrl}/auth/login`, loginInput, {
          headers: { 'Content-Type': 'application/json' }
        })
      );
      console.log('Login response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Login error:', error.response?.data || error.message, 'Status:', error.response?.status, 'Config:', error.config);
      throw new HttpException(
        error.response?.data?.message || 'Cannot POST /auth/login',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getUserById(id: string, token?: string) {
    try {
      const headers = token ? { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } : { 'Content-Type': 'application/json' };
      const response = await firstValueFrom(
        this.httpService.get(`${this.userServiceUrl}/users/${id}`, { headers })
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response?.data?.message || 'User not found',
        error.response?.status || HttpStatus.NOT_FOUND
      );
    }
  }

  async getAllUsers(token?: string) {
    try {
      const headers = token ? { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } : { 'Content-Type': 'application/json' };
      const response = await firstValueFrom(
        this.httpService.get(`${this.userServiceUrl}/users`, { headers })
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response?.data?.message || 'Failed to fetch users',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}