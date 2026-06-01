import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SettingsService {
  private readonly logger = new Logger(SettingsService.name);

  constructor(private readonly prisma: PrismaService) {}

  async get(userId: string) {
    let setting = await this.prisma.setting.findUnique({ where: { userId } });
    if (!setting) {
      setting = await this.prisma.setting.create({
        data: { userId, pricePerBalaio: 40.0 },
      });
    }
    return { pricePerBalaio: Number(setting.pricePerBalaio) };
  }

  async update(userId: string, pricePerBalaio: number) {
    const setting = await this.prisma.setting.upsert({
      where: { userId },
      update: { pricePerBalaio },
      create: { userId, pricePerBalaio },
    });
    this.logger.log(`Settings updated for user ${userId}`);
    return { pricePerBalaio: Number(setting.pricePerBalaio) };
  }

  async getPricePerBalaio(userId: string): Promise<number> {
    const s = await this.get(userId);
    return s.pricePerBalaio;
  }
}
