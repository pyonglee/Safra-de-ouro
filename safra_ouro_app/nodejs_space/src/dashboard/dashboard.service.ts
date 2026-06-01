import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { HarvestsService } from '../harvests/harvests.service';

@Injectable()
export class DashboardService {
  private readonly logger = new Logger(DashboardService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly harvestsService: HarvestsService,
  ) {}

  async getDashboard(userId: string, harvestId?: string) {
    // Get all harvests for selector
    const allHarvests = await this.prisma.harvest.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      select: { id: true, name: true },
    });

    // Determine current harvest
    let currentHarvest: { id: string; name: string } | null = null;
    if (harvestId) {
      const h = allHarvests.find((h) => h.id === harvestId);
      if (h) currentHarvest = h;
    }
    if (!currentHarvest && allHarvests.length > 0) {
      currentHarvest = allHarvests[0];
    }

    if (!currentHarvest) {
      return {
        currentHarvest: null,
        harvests: [],
        totalSacks: 0,
        totalRevenue: 0,
        totalExpenses: 0,
        totalWorkerPayments: 0,
        grandTotalCosts: 0,
        netProfit: 0,
        profitMargin: 0,
        recentActivity: [],
      };
    }

    const hId = currentHarvest.id;

    // Get harvest with price
    const harvest = await this.prisma.harvest.findUnique({ where: { id: hId } });
    const salePricePerSack = harvest ? (parseFloat(String(harvest.salePricePerSack ?? 0)) || 0) : 0;

    // Aggregations
    const prodAgg = await this.prisma.production_record.aggregate({
      where: { userId, harvestId: hId },
      _sum: { sacks: true },
    });
    const totalSacks = prodAgg._sum.sacks || 0;
    const totalRevenue = totalSacks * salePricePerSack;

    const expenseAgg = await this.prisma.expense.aggregate({
      where: { userId, harvestId: hId },
      _sum: { cost: true },
    });
    const totalExpenses = parseFloat(String(expenseAgg._sum.cost ?? 0)) || 0;

    const balaioAgg = await this.prisma.balaio_record.aggregate({
      where: { userId, harvestId: hId },
      _sum: { totalValue: true },
    });
    const totalWorkerPayments = parseFloat(String(balaioAgg._sum.totalValue ?? 0)) || 0;

    const grandTotalCosts = totalExpenses + totalWorkerPayments;
    const netProfit = totalRevenue - grandTotalCosts;
    const profitMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;

    // Recent activity (last 10 events)
    const recentBalaios = await this.prisma.balaio_record.findMany({
      where: { userId, harvestId: hId },
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: { worker: { select: { name: true } } },
    });

    const recentExpenses = await this.prisma.expense.findMany({
      where: { userId, harvestId: hId },
      orderBy: { createdAt: 'desc' },
      take: 5,
    });

    const recentProduction = await this.prisma.production_record.findMany({
      where: { userId, harvestId: hId },
      orderBy: { createdAt: 'desc' },
      take: 5,
    });

    const recentActivity = [
      ...recentBalaios.map((b) => ({
        type: 'balaio',
        description: `${b.worker.name}: ${b.quantity} balaios`,
        date: b.createdAt.toISOString(),
        value: parseFloat(String(b.totalValue ?? 0)) || 0,
      })),
      ...recentExpenses.map((e) => ({
        type: 'expense',
        description: `${e.productName} (${e.category})`,
        date: e.createdAt.toISOString(),
        value: parseFloat(String(e.cost ?? 0)) || 0,
      })),
      ...recentProduction.map((p) => ({
        type: 'production',
        description: `${p.sacks} sacas produzidas`,
        date: p.createdAt.toISOString(),
        value: p.sacks,
      })),
    ]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 10);

    return {
      currentHarvest,
      harvests: allHarvests,
      totalSacks,
      totalRevenue,
      totalExpenses,
      totalWorkerPayments,
      grandTotalCosts,
      netProfit,
      profitMargin: Math.round(profitMargin * 100) / 100,
      recentActivity,
    };
  }
}
