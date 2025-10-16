import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { QuotationItem } from './quotation-item.entity';

@Injectable()
export class QuotationItemService {
  constructor(
    @InjectRepository(QuotationItem)
    private quotationItemRepository: Repository<QuotationItem>,
  ) { }

  async create(body: QuotationItem): Promise<QuotationItem> {
    body.itemId = body.item.id;

    const quotationItem = this.quotationItemRepository.create(body);

    return await this.quotationItemRepository.save(quotationItem);
  }

  async findAll(page: number = 1, limit: number = 10, search?: string): Promise<{ quotationItems: QuotationItem[]; total: number }> {
    const skip = (page - 1) * limit;
    const where = search
      ? [
        { item: Like(`%${search}%`) },
        { description: Like(`%${search}%`) },
        { code: Like(`%${search}%`) }
      ]
      : {};

    const [quotationItems, total] = await this.quotationItemRepository.findAndCount({
      where,
      skip,
      take: limit,
      order: { id: 'DESC' },
    });

    return { quotationItems: quotationItems, total };
  }

  async findById(id: number): Promise<QuotationItem> {
    const quotationItem = await this.quotationItemRepository.findOne({ where: { id } });

    if (!quotationItem) {
      throw new NotFoundException('Item da Cotação não encontrado');
    }

    return quotationItem;
  }

  async findByQuotationId(id: number): Promise<QuotationItem[]> {
    const quotationItems = await this.quotationItemRepository.find({ where: { quotationId: id } });

    if (!quotationItems) {
      throw new NotFoundException('Itens de Cotação não encontrado');
    }

    return quotationItems;
  }

  async update(id: number, body: QuotationItem): Promise<QuotationItem> {
    await this.quotationItemRepository.update(id, body);

    return this.findById(id);
  }

  async remove(id: number): Promise<void> {
    const request = await this.findById(id);

    await this.quotationItemRepository.remove(request);
  }

  async count(): Promise<number> {
    return this.quotationItemRepository.count();
  }
}