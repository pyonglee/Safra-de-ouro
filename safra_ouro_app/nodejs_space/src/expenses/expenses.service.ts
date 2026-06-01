import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ExpensesService {
  private readonly logger = new Logger(ExpensesService.name);

  constructor(private readonly prisma: PrismaService) {}

  private format(e: any) {
    return {
      id: e.id,
      harvestId: e.harvestId,
      category: e.category,
      productName: e.productName,
      date: e.date.toISOString(),
      quantity: e.quantity ? Number(e.quantity) : null,
      unit: e.unit,
      appliedArea: e.appliedArea ? Number(e.appliedArea) : null,
      cost: Number(e.cost),
      notes: e.notes,
      createdAt: e.createdAt.toISOString(),
    };
  }

  async findAll(userId: string, filters: { harvestId?: string; category?: string }) {
    const where: any = { userId };
    if (filters.harvestId) where.harvestId = filters.harvestId;
    if (filters.category) where.category = filters.category;

    const expenses = await this.prisma.expense.findMany({
      where,
      orderBy: { date: 'desc' },
    });

    const totalCost = expenses.reduce((sum, e) => sum + Number(e.cost), 0);

    return {
      items: expenses.map((e) => this.format(e)),
      totalCost,
    };
  }

  async findOne(userId: string, id: string) {
    const expense = await this.prisma.expense.findFirst({ where: { id, userId } });
    if (!expense) throw new NotFoundException('Expense not found');
    return this.format(expense);
  }

  async create(userId: string, data: any) {
    const harvest = await this.prisma.harvest.findFirst({ where: { id: data.harvestId, userId } });
    if (!harvest) throw new NotFoundException('Harvest not found');

    const expense = await this.prisma.expense.create({
      data: {
        userId,
        harvestId: data.harvestId,
        category: data.category,
        productName: data.productName,
        date: new Date(data.date),
        quantity: data.quantity ?? null,
        unit: data.unit ?? null,
        appliedArea: data.appliedArea ?? null,
        cost: data.cost,
        notes: data.notes ?? null,
      },
    });

    this.logger.log(`Expense created: ${data.productName} - R$ ${data.cost}`);
    return this.format(expense);
  }

  async update(userId: string, id: string, data: any) {
    const existing = await this.prisma.expense.findFirst({ where: { id, userId } });
    if (!existing) throw new NotFoundException('Expense not found');

    const updateData: any = {};
    if (data.category !== undefined) updateData.category = data.category;
    if (data.productName !== undefined) updateData.productName = data.productName;
    if (data.date !== undefined) updateData.date = new Date(data.date);
    if (data.quantity !== undefined) updateData.quantity = data.quantity;
    if (data.unit !== undefined) updateData.unit = data.unit;
    if (data.appliedArea !== undefined) updateData.appliedArea = data.appliedArea;
    if (data.cost !== undefined) updateData.cost = data.cost;
    if (data.notes !== undefined) updateData.notes = data.notes;

    const expense = await this.prisma.expense.update({ where: { id }, data: updateData });
    return this.format(expense);
  }

  async remove(userId: string, id: string) {
    const existing = await this.prisma.expense.findFirst({ where: { id, userId } });
    if (!existing) throw new NotFoundException('Expense not found');
    await this.prisma.expense.delete({ where: { id } });
    return { success: true };
  }
}
