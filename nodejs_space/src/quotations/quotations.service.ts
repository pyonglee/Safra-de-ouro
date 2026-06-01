import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class QuotationsService {
  private readonly logger = new Logger(QuotationsService.name);

  constructor(private readonly prisma: PrismaService) {}

  async findAll(userId: string, coffeeType?: string) {
    const where: any = { userId };
    if (coffeeType) where.coffeeType = coffeeType;

    const quotations = await this.prisma.quotation.findMany({
      where,
      orderBy: { date: 'desc' },
    });

    const items = quotations.map((q) => ({
      id: q.id,
      coffeeType: q.coffeeType,
      pricePerSack: Number(q.pricePerSack),
      date: q.date.toISOString(),
      source: q.source,
      createdAt: q.createdAt.toISOString(),
    }));

    // Build latestByType
    const typeMap: Record<string, any[]> = {};
    for (const q of items) {
      if (!typeMap[q.coffeeType]) typeMap[q.coffeeType] = [];
      typeMap[q.coffeeType].push(q);
    }

    const latestByType: Record<string, any> = {};
    for (const [type, list] of Object.entries(typeMap)) {
      const sorted = list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      const current = sorted[0];
      const previous = sorted.length > 1 ? sorted[1] : null;
      let trend: 'up' | 'down' | 'stable' = 'stable';
      if (previous) {
        if (current.pricePerSack > previous.pricePerSack) trend = 'up';
        else if (current.pricePerSack < previous.pricePerSack) trend = 'down';
      }
      latestByType[type] = {
        current: { pricePerSack: current.pricePerSack, date: current.date },
        previous: previous ? { pricePerSack: previous.pricePerSack, date: previous.date } : null,
        trend,
      };
    }

    return { items, latestByType };
  }

  async create(userId: string, data: { coffeeType: string; pricePerSack: number; date: string; source?: string }) {
    const quotation = await this.prisma.quotation.create({
      data: {
        userId,
        coffeeType: data.coffeeType,
        pricePerSack: data.pricePerSack,
        date: new Date(data.date),
        source: data.source || null,
      },
    });

    this.logger.log(`Quotation created: ${data.coffeeType} R$ ${data.pricePerSack}`);
    return {
      id: quotation.id,
      coffeeType: quotation.coffeeType,
      pricePerSack: Number(quotation.pricePerSack),
      date: quotation.date.toISOString(),
      source: quotation.source,
      createdAt: quotation.createdAt.toISOString(),
    };
  }

  async remove(userId: string, id: string) {
    const existing = await this.prisma.quotation.findFirst({ where: { id, userId } });
    if (!existing) throw new NotFoundException('Quotation not found');
    await this.prisma.quotation.delete({ where: { id } });
    return { success: true };
  }
}
