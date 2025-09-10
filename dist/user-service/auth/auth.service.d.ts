import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
export interface JwtPayload {
    sub: number;
    email: string;
    iat?: number;
    exp?: number;
}
export interface AuthResponse {
    access_token: string;
    user: {
        id: number;
        email: string;
        firstName: string;
        lastName: string;
    };
}
export declare class AuthService {
    private readonly usersService;
    private readonly jwtService;
    constructor(usersService: UsersService, jwtService: JwtService);
    login(loginDto: LoginDto): Promise<AuthResponse>;
    validateUser(payload: JwtPayload): Promise<import("../users/user.entity").User>;
}
