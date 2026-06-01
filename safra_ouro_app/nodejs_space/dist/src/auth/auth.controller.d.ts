import { AuthService } from './auth.service';
import { SignupDto, LoginDto, UpdateProfileDto } from './auth.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    signup(dto: SignupDto): Promise<{
        token: string;
        user: {
            id: string;
            email: string;
            name: string;
        };
    }>;
    login(dto: LoginDto): Promise<{
        token: string;
        user: {
            id: string;
            email: string;
            name: string;
        };
    }>;
    getMe(req: any): Promise<{
        user: {
            id: string;
            email: string;
            name: string;
        };
    }>;
    updateMe(req: any, dto: UpdateProfileDto): Promise<{
        user: {
            id: string;
            email: string;
            name: string;
        };
    }>;
}
