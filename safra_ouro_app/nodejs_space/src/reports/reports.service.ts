import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReportsService {
  private readonly logger = new Logger(ReportsService.name);

  constructor(private readonly prisma: PrismaService) {}

  async getExpenseReport(userId: string, filters: { harvestId?: string; startDate?: string; endDate?: string }) {
    const where: any = { userId };
    if (filters.harvestId) where.harvestId = filters.harvestId;
    if (filters.startDate || filters.endDate) {
      where.date = {};
      if (filters.startDate) where.date.gte = new Date(filters.startDate);
      if (filters.endDate) where.date.lte = new Date(filters.endDate);
    }

    const expenses = await this.prisma.expense.findMany({ where, orderBy: { date: 'desc' } });

    let harvestName: string | null = null;
    if (filters.harvestId) {
      const h = await this.prisma.harvest.findUnique({ where: { id: filters.harvestId } });
      if (h) harvestName = h.name;
    }

    // Group by category
    const categoryMap: Record<string, { total: number; items: Record<string, { totalCost: number; totalQuantity: number | null; unit: string | null }> }> = {};
    for (const e of expenses) {
      if (!categoryMap[e.category]) categoryMap[e.category] = { total: 0, items: {} };
      categoryMap[e.category].total += Number(e.cost);
      const key = e.productName;
      if (!categoryMap[e.category].items[key]) {
        categoryMap[e.category].items[key] = { totalCost: 0, totalQuantity: null, unit: e.unit };
      }
      categoryMap[e.category].items[key].totalCost += Number(e.cost);
      if (e.quantity !== null) {
        categoryMap[e.category].items[key].totalQuantity =
          (categoryMap[e.category].items[key].totalQuantity || 0) + Number(e.quantity);
      }
    }

    const byCategory = Object.entries(categoryMap).map(([category, data]) => ({
      category,
      total: data.total,
      items: Object.entries(data.items).map(([productName, info]) => ({
        productName,
        totalCost: info.totalCost,
        totalQuantity: info.totalQuantity,
        unit: info.unit,
      })),
    }));

    const grandTotal = expenses.reduce((sum, e) => sum + Number(e.cost), 0);

    return { byCategory, grandTotal, harvestName };
  }

  async getWorkerReport(userId: string, harvestId?: string) {
    const where: any = { userId };
    if (harvestId) where.harvestId = harvestId;

    let harvestName: string | null = null;
    if (harvestId) {
      const h = await this.prisma.harvest.findUnique({ where: { id: harvestId } });
      if (h) harvestName = h.name;
    }

    const balaioRecords = await this.prisma.balaio_record.findMany({
      where,
      orderBy: { date: 'desc' },
      include: { worker: { select: { id: true, name: true } } },
    });

    // Group by worker
    const workerMap: Record<string, { name: string; totalBalaios: number; totalEarned: number; records: any[] }> = {};
    for (const r of balaioRecords) {
      if (!workerMap[r.workerId]) {
        workerMap[r.workerId] = { name: r.worker.name, totalBalaios: 0, totalEarned: 0, records: [] };
      }
      workerMap[r.workerId].totalBalaios += r.quantity;
      workerMap[r.workerId].totalEarned += Number(r.totalValue);
      workerMap[r.workerId].records.push({
        date: r.date.toISOString(),
        quantity: r.quantity,
        pricePerBalaio: Number(r.pricePerBalaio),
        totalValue: Number(r.totalValue),
      });
    }

    const workers = Object.entries(workerMap).map(([id, data]) => ({
      id,
      name: data.name,
      totalBalaios: data.totalBalaios,
      totalEarned: data.totalEarned,
      records: data.records,
    }));

    const grandTotalBalaios = workers.reduce((sum, w) => sum + w.totalBalaios, 0);
    const grandTotalPaid = workers.reduce((sum, w) => sum + w.totalEarned, 0);

    return { workers, grandTotalBalaios, grandTotalPaid, harvestName };
  }

  async getProductionReport(userId: string, harvestId?: string) {
    const where: any = { userId };
    if (harvestId) where.id = harvestId;

    const harvests = await this.prisma.harvest.findMany({
      where: { userId, ...(harvestId ? { id: harvestId } : {}) },
      orderBy: { createdAt: 'desc' },
      include: { productionRecords: true },
    });

    const harvestData = harvests.map((h) => {
      const totalSacks = h.productionRecords.reduce((sum, p) => sum + p.sacks, 0);
      return {
        id: h.id,
        name: h.name,
        totalSacks,
        salePricePerSack: Number(h.salePricePerSack),
        totalRevenue: totalSacks * Number(h.salePricePerSack),
      };
    });

    const grandTotalSacks = harvestData.reduce((sum, h) => sum + h.totalSacks, 0);
    const grandTotalRevenue = harvestData.reduce((sum, h) => sum + h.totalRevenue, 0);

    return { harvests: harvestData, grandTotalSacks, grandTotalRevenue };
  }

  async getProfitReport(userId: string, harvestId?: string) {
    let harvestName: string | null = null;
    let targetHarvestId = harvestId;

    if (!targetHarvestId) {
      const latest = await this.prisma.harvest.findFirst({
        where: { userId },
        orderBy: { createdAt: 'desc' },
      });
      if (latest) {
        targetHarvestId = latest.id;
        harvestName = latest.name;
      }
    } else {
      const h = await this.prisma.harvest.findUnique({ where: { id: targetHarvestId } });
      if (h) harvestName = h.name;
    }

    if (!targetHarvestId) {
      return {
        harvestName: null,
        totalRevenue: 0,
        expenseBreakdown: [],
        totalExpenses: 0,
        totalWorkerPayments: 0,
        grandTotalCosts: 0,
        netProfit: 0,
        profitMargin: 0,
      };
    }

    const harvest = await this.prisma.harvest.findUnique({ where: { id: targetHarvestId } });
    const salePricePerSack = harvest ? Number(harvest.salePricePerSack) : 0;

    const prodAgg = await this.prisma.production_record.aggregate({
      where: { userId, harvestId: targetHarvestId },
      _sum: { sacks: true },
    });
    const totalSacks = prodAgg._sum.sacks || 0;
    const totalRevenue = totalSacks * salePricePerSack;

    // Expense breakdown by category
    const expenses = await this.prisma.expense.findMany({
      where: { userId, harvestId: targetHarvestId },
    });

    const categoryTotals: Record<string, number> = {};
    for (const e of expenses) {
      categoryTotals[e.category] = (categoryTotals[e.category] || 0) + Number(e.cost);
    }
    const expenseBreakdown = Object.entries(categoryTotals).map(([category, total]) => ({ category, total }));
    const totalExpenses = Object.values(categoryTotals).reduce((sum, v) => sum + v, 0);

    const balaioAgg = await this.prisma.balaio_record.aggregate({
      where: { userId, harvestId: targetHarvestId },
      _sum: { totalValue: true },
    });
    const totalWorkerPayments = Number(balaioAgg._sum.totalValue || 0);

    const grandTotalCosts = totalExpenses + totalWorkerPayments;
    const netProfit = totalRevenue - grandTotalCosts;
    const profitMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;

    return {
      harvestName,
      totalRevenue,
      expenseBreakdown,
      totalExpenses,
      totalWorkerPayments,
      grandTotalCosts,
      netProfit,
      profitMargin: Math.round(profitMargin * 100) / 100,
    };
  }
}
