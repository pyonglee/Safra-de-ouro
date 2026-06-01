import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class WorkersService {
  private readonly logger = new Logger(WorkersService.name);

  constructor(private readonly prisma: PrismaService) {}

  async findAll(userId: string, harvestId?: string) {
    const workers = await this.prisma.worker.findMany({
      where: { userId },
      orderBy: { name: 'asc' },
      include: {
        balaioRecords: harvestId ? { where: { harvestId } } : true,
      },
    });

    const items = workers.map((w) => {
      const records = w.balaioRecords;
      const totalBalaios = records.reduce((sum, r) => sum + r.quantity, 0);
      const totalEarned = records.reduce((sum, r) => sum + Number(r.totalValue), 0);
      const lastRecord = records.length > 0
        ? records.sort((a, b) => b.date.getTime() - a.date.getTime())[0]
        : null;
      return {
        id: w.id,
        name: w.name,
        totalBalaios,
        totalEarned,
        lastRecordDate: lastRecord ? lastRecord.date.toISOString() : null,
        createdAt: w.createdAt.toISOString(),
      };
    });

    return { items };
  }

  async findOne(userId: string, id: string, harvestId?: string) {
    const worker = await this.prisma.worker.findFirst({
      where: { id, userId },
      include: {
        balaioRecords: harvestId ? { where: { harvestId } } : true,
      },
    });
    if (!worker) throw new NotFoundException('Worker not found');

    const records = worker.balaioRecords;
    const totalBalaios = records.reduce((sum, r) => sum + r.quantity, 0);
    const totalEarned = records.reduce((sum, r) => sum + Number(r.totalValue), 0);
    const uniqueDays = new Set(records.map((r) => r.date.toISOString().split('T')[0])).size;
    const avgBalaiosPerDay = uniqueDays > 0 ? totalBalaios / uniqueDays : 0;

    return {
      id: worker.id,
      name: worker.name,
      totalBalaios,
      totalEarned,
      avgBalaiosPerDay: Math.round(avgBalaiosPerDay * 100) / 100,
      createdAt: worker.createdAt.toISOString(),
    };
  }

  async create(userId: string, name: string) {
    const worker = await this.prisma.worker.create({
      data: { userId, name },
    });
    this.logger.log(`Worker created: ${worker.name} for user ${userId}`);
    return { id: worker.id, name: worker.name, createdAt: worker.createdAt.toISOString() };
  }

  async update(userId: string, id: string, name: string) {
    const worker = await this.prisma.worker.findFirst({ where: { id, userId } });
    if (!worker) throw new NotFoundException('Worker not found');
    const updated = await this.prisma.worker.update({ where: { id }, data: { name } });
    return { id: updated.id, name: updated.name };
  }

  async remove(userId: string, id: string) {
    const worker = await this.prisma.worker.findFirst({ where: { id, userId } });
    if (!worker) throw new NotFoundException('Worker not found');
    await this.prisma.worker.delete({ where: { id } });
    return { success: true };
  }
}
