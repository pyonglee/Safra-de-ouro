import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProductionRecordsService {
  private readonly logger = new Logger(ProductionRecordsService.name);

  constructor(private readonly prisma: PrismaService) {}

  async findAll(userId: string, harvestId?: string) {
    const where: any = { userId };
    if (harvestId) where.harvestId = harvestId;

    const records = await this.prisma.production_record.findMany({
      where,
      orderBy: { date: 'desc' },
    });

    return {
      items: records.map((r) => ({
        id: r.id,
        harvestId: r.harvestId,
        date: r.date.toISOString(),
        sacks: r.sacks,
        notes: r.notes,
        createdAt: r.createdAt.toISOString(),
      })),
    };
  }

  async create(userId: string, data: { harvestId: string; date: string; sacks: number; notes?: string }) {
    const harvest = await this.prisma.harvest.findFirst({ where: { id: data.harvestId, userId } });
    if (!harvest) throw new NotFoundException('Harvest not found');

    const record = await this.prisma.production_record.create({
      data: {
        userId,
        harvestId: data.harvestId,
        date: new Date(data.date),
        sacks: data.sacks,
        notes: data.notes || null,
      },
    });

    this.logger.log(`Production record created: ${data.sacks} sacks`);
    return {
      id: record.id,
      harvestId: record.harvestId,
      date: record.date.toISOString(),
      sacks: record.sacks,
      notes: record.notes,
      createdAt: record.createdAt.toISOString(),
    };
  }

  async remove(userId: string, id: string) {
    const record = await this.prisma.production_record.findFirst({ where: { id, userId } });
    if (!record) throw new NotFoundException('Production record not found');
    await this.prisma.production_record.delete({ where: { id } });
    return { success: true };
  }
}
