import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { RequestItem } from './request-item.entity';

@Injectable()
export class RequestItemService {
  constructor(
    @InjectRepository(RequestItem)
    private requestItemRepository: Repository<RequestItem>,
  ) { }

  async create(body: RequestItem): Promise<RequestItem> {
    body.itemId = body.item.id;

    const requestItem = this.requestItemRepository.create(body);

    return await this.requestItemRepository.save(requestItem);
  }

  async findAll(page: number = 1, limit: number = 10, search?: string): Promise<{ requestItems: RequestItem[]; total: number }> {
    const skip = (page - 1) * limit;
    const where = search
      ? [
        { item: Like(`%${search}%`) },
        { description: Like(`%${search}%`) },
        { code: Like(`%${search}%`) }
      ]
      : {};

    const [requestItems, total] = await this.requestItemRepository.findAndCount({
      where,
      skip,
      take: limit,
      order: { id: 'DESC' },
    });

    return { requestItems: requestItems, total };
  }

  async findById(id: number): Promise<RequestItem> {
    const requestItem = await this.requestItemRepository.findOne({ where: { id } });

    if (!requestItem) {
      throw new NotFoundException('Item de Pedido não encontrado');
    }

    return requestItem;
  }

  async findByRequestId(id: number): Promise<RequestItem[]> {
    const requestItems = await this.requestItemRepository.find({ where: { requestId: id } });

    if (!requestItems) {
      throw new NotFoundException('Itens de Pedido não encontrado');
    }

    return requestItems;
  }

  async update(id: number, body: RequestItem): Promise<RequestItem> {
    await this.requestItemRepository.update(id, body);

    return this.findById(id);
  }

  async remove(id: number): Promise<void> {
    const request = await this.findById(id);

    await this.requestItemRepository.remove(request);
  }

  async count(): Promise<number> {
    return this.requestItemRepository.count();
  }
}