import { Injectable, UnauthorizedException, ConflictException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async signup(email: string, password: string, name: string) {
    const existing = await this.prisma.user.findUnique({ where: { email } });
    if (existing) {
      throw new ConflictException('Email already registered');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        setting: {
          create: { pricePerBalaio: 40.0 },
        },
      },
    });

    const token = this.jwtService.sign({ sub: user.id, email: user.email });
    this.logger.log(`User signed up: ${user.email}`);
    return { token, user: { id: user.id, email: user.email, name: user.name } };
  }

  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = this.jwtService.sign({ sub: user.id, email: user.email });
    this.logger.log(`User logged in: ${user.email}`);
    return { token, user: { id: user.id, email: user.email, name: user.name } };
  }

  async getMe(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new UnauthorizedException();
    return { user: { id: user.id, email: user.email, name: user.name } };
  }

  async updateMe(userId: string, name: string) {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: { name },
    });
    return { user: { id: user.id, email: user.email, name: user.name } };
  }
}
