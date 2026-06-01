import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SettingsService } from '../settings/settings.service';

@Injectable()
export class BalaioRecordsService {
  private readonly logger = new Logger(BalaioRecordsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly settingsService: SettingsService,
  ) {}

  async findAll(userId: string, filters: { workerId?: string; harvestId?: string; date?: string }) {
    const where: any = { userId };
    if (filters.workerId) where.workerId = filters.workerId;
    if (filters.harvestId) where.harvestId = filters.harvestId;
    if (filters.date) {
      const d = new Date(filters.date);
      const nextDay = new Date(d);
      nextDay.setDate(nextDay.getDate() + 1);
      where.date = { gte: d, lt: nextDay };
    }

    const records = await this.prisma.balaio_record.findMany({
      where,
      orderBy: { date: 'desc' },
      include: { worker: { select: { name: true } } },
    });

    const items = records.map((r) => ({
      id: r.id,
      workerId: r.workerId,
      workerName: r.worker.name,
      harvestId: r.harvestId,
      date: r.date.toISOString(),
      quantity: r.quantity,
      pricePerBalaio: Number(r.pricePerBalaio),
      totalValue: Number(r.totalValue),
      createdAt: r.createdAt.toISOString(),
    }));

    return { items };
  }

  async create(userId: string, data: { workerId: string; harvestId: string; date: string; quantity: number }) {
    // Verify worker belongs to user
    const worker = await this.prisma.worker.findFirst({ where: { id: data.workerId, userId } });
    if (!worker) throw new NotFoundException('Worker not found');

    // Verify harvest belongs to user
    const harvest = await this.prisma.harvest.findFirst({ where: { id: data.harvestId, userId } });
    if (!harvest) throw new NotFoundException('Harvest not found');

    const pricePerBalaio = await this.settingsService.getPricePerBalaio(userId);
    const totalValue = data.quantity * pricePerBalaio;

    const record = await this.prisma.balaio_record.create({
      data: {
        userId,
        workerId: data.workerId,
        harvestId: data.harvestId,
        date: new Date(data.date),
        quantity: data.quantity,
        pricePerBalaio,
        totalValue,
      },
      include: { worker: { select: { name: true } } },
    });

    this.logger.log(`Balaio record created: ${data.quantity} balaios for worker ${worker.name}`);
    return {
      id: record.id,
      workerId: record.workerId,
      workerName: record.worker.name,
      harvestId: record.harvestId,
      date: record.date.toISOString(),
      quantity: record.quantity,
      pricePerBalaio: Number(record.pricePerBalaio),
      totalValue: Number(record.totalValue),
      createdAt: record.createdAt.toISOString(),
    };
  }

  async remove(userId: string, id: string) {
    const record = await this.prisma.balaio_record.findFirst({ where: { id, userId } });
    if (!record) throw new NotFoundException('Balaio record not found');
    await this.prisma.balaio_record.delete({ where: { id } });
    return { success: true };
  }
}
