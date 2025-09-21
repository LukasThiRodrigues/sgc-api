import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Item } from './item.entity';

@Injectable()
export class ItemService {
  constructor(
    @InjectRepository(Item)
    private itemRepository: Repository<Item>,
  ) { }

  async create(body: Item): Promise<Item> {
    const existingCode = await this.findByCode(body.code);

    if (existingCode) {
      throw new BadRequestException('Código já existe');
    }

    const item = this.itemRepository.create(body);

    return await this.itemRepository.save(item);
  }

  async findAll(page: number = 1, limit: number = 10, search?: string): Promise<{ items: Item[]; total: number }> {
    const skip = (page - 1) * limit;
    const where = search
      ? [
        { item: Like(`%${search}%`) },
        { description: Like(`%${search}%`) },
        { code: Like(`%${search}%`) }
      ]
      : {};

    const [items, total] = await this.itemRepository.findAndCount({
      where,
      skip,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return { items, total };
  }

  async findByCode(code: string): Promise<Item | null> {
    return this.itemRepository.findOne({ where: { code } });
  }

  async findById(id: number): Promise<Item> {
    const item = await this.itemRepository.findOne({ where: { id } });

    if (!item) {
      throw new NotFoundException('Item não encontrado');
    }

    return item;
  }

  async update(id: number, body: Item): Promise<Item> {
    const oldItem = await this.findById(id);

    if (body.code && body.code !== oldItem.code) {
      const existingItem = await this.findByCode(body.code);

      if (existingItem) {
        throw new BadRequestException('Código já está em uso');
      }
    }

    await this.itemRepository.update(id, body);

    return this.findById(id);
  }

  async remove(id: number): Promise<void> {
    const item = await this.findById(id);

    await this.itemRepository.remove(item);
  }

  async count(): Promise<number> {
    return this.itemRepository.count();
  }
}