import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
export declare class AuthService {
    private readonly prisma;
    private readonly jwtService;
    private readonly logger;
    constructor(prisma: PrismaService, jwtService: JwtService);
    signup(email: string, password: string, name: string): Promise<{
        token: string;
        user: {
            id: string;
            email: string;
            name: string;
        };
    }>;
    login(email: string, password: string): Promise<{
        token: string;
        user: {
            id: string;
            email: string;
            name: string;
        };
    }>;
    getMe(userId: string): Promise<{
        user: {
            id: string;
            email: string;
            name: string;
        };
    }>;
    updateMe(userId: string, name: string): Promise<{
        user: {
            id: string;
            email: string;
            name: string;
        };
    }>;
}
