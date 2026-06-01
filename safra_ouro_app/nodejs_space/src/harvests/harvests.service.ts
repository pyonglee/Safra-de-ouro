import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class HarvestsService {
  private readonly logger = new Logger(HarvestsService.name);

  constructor(private readonly prisma: PrismaService) {}

  async findAll(userId: string) {
    const harvests = await this.prisma.harvest.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        productionRecords: true,
        expenses: true,
        balaioRecords: true,
      },
    });

    const items = harvests.map((h) => {
      const totalSacks = h.productionRecords.reduce((sum, p) => sum + p.sacks, 0);
      const totalRevenue = totalSacks * Number(h.salePricePerSack);
      const totalExpenses = h.expenses.reduce((sum, e) => sum + Number(e.cost), 0);
      const totalWorkerPayments = h.balaioRecords.reduce((sum, b) => sum + Number(b.totalValue), 0);
      const grandTotalCosts = totalExpenses + totalWorkerPayments;
      const netProfit = totalRevenue - grandTotalCosts;
      const profitMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;

      return {
        id: h.id,
        name: h.name,
        salePricePerSack: Number(h.salePricePerSack),
        totalSacks,
        totalRevenue,
        netProfit,
        profitMargin: Math.round(profitMargin * 100) / 100,
        createdAt: h.createdAt.toISOString(),
      };
    });

    return { items };
  }

  async findOne(userId: string, id: string) {
    const h = await this.prisma.harvest.findFirst({
      where: { id, userId },
      include: {
        productionRecords: { orderBy: { date: 'desc' } },
        expenses: true,
        balaioRecords: true,
      },
    });
    if (!h) throw new NotFoundException('Harvest not found');

    const totalSacks = h.productionRecords.reduce((sum, p) => sum + p.sacks, 0);
    const totalRevenue = totalSacks * Number(h.salePricePerSack);
    const totalExpenses = h.expenses.reduce((sum, e) => sum + Number(e.cost), 0);
    const totalWorkerPayments = h.balaioRecords.reduce((sum, b) => sum + Number(b.totalValue), 0);
    const grandTotalCosts = totalExpenses + totalWorkerPayments;
    const netProfit = totalRevenue - grandTotalCosts;
    const profitMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;

    const fertilizerCost = h.expenses.filter(e => e.category === 'FERTILIZER').reduce((s, e) => s + Number(e.cost), 0);
    const sprayingCost = h.expenses.filter(e => e.category === 'SPRAYING').reduce((s, e) => s + Number(e.cost), 0);
    const otherCost = h.expenses.filter(e => e.category === 'OTHER').reduce((s, e) => s + Number(e.cost), 0);

    return {
      id: h.id,
      name: h.name,
      salePricePerSack: Number(h.salePricePerSack),
      startDate: h.startDate ? h.startDate.toISOString() : null,
      endDate: h.endDate ? h.endDate.toISOString() : null,
      totalSacks,
      totalRevenue,
      totalExpenses,
      totalWorkerPayments,
      grandTotalCosts,
      netProfit,
      profitMargin: Math.round(profitMargin * 100) / 100,
      expenseBreakdown: {
        fertilizer: fertilizerCost,
        spraying: sprayingCost,
        other: otherCost,
      },
      productionRecords: h.productionRecords.map((p) => ({
        id: p.id,
        harvestId: p.harvestId,
        date: p.date.toISOString(),
        sacks: p.sacks,
        notes: p.notes,
        createdAt: p.createdAt.toISOString(),
      })),
      createdAt: h.createdAt.toISOString(),
    };
  }

  async create(userId: string, data: { name: string; salePricePerSack: number; startDate?: string; endDate?: string }) {
    const harvest = await this.prisma.harvest.create({
      data: {
        userId,
        name: data.name,
        salePricePerSack: data.salePricePerSack,
        startDate: data.startDate ? new Date(data.startDate) : null,
        endDate: data.endDate ? new Date(data.endDate) : null,
      },
    });
    this.logger.log(`Harvest created: ${harvest.name}`);
    return {
      id: harvest.id,
      name: harvest.name,
      salePricePerSack: Number(harvest.salePricePerSack),
      startDate: harvest.startDate ? harvest.startDate.toISOString() : null,
      endDate: harvest.endDate ? harvest.endDate.toISOString() : null,
      createdAt: harvest.createdAt.toISOString(),
    };
  }

  async update(userId: string, id: string, data: { name?: string; salePricePerSack?: number; startDate?: string; endDate?: string }) {
    const existing = await this.prisma.harvest.findFirst({ where: { id, userId } });
    if (!existing) throw new NotFoundException('Harvest not found');

    const updateData: any = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.salePricePerSack !== undefined) updateData.salePricePerSack = data.salePricePerSack;
    if (data.startDate !== undefined) updateData.startDate = data.startDate ? new Date(data.startDate) : null;
    if (data.endDate !== undefined) updateData.endDate = data.endDate ? new Date(data.endDate) : null;

    const harvest = await this.prisma.harvest.update({ where: { id }, data: updateData });
    return {
      id: harvest.id,
      name: harvest.name,
      salePricePerSack: Number(harvest.salePricePerSack),
      startDate: harvest.startDate ? harvest.startDate.toISOString() : null,
      endDate: harvest.endDate ? harvest.endDate.toISOString() : null,
    };
  }

  async remove(userId: string, id: string) {
    const existing = await this.prisma.harvest.findFirst({ where: { id, userId } });
    if (!existing) throw new NotFoundException('Harvest not found');
    await this.prisma.harvest.delete({ where: { id } });
    return { success: true };
  }

  async getLatestHarvest(userId: string) {
    return this.prisma.harvest.findFirst({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }
}
