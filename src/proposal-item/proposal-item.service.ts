import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { ProposalItem } from './proposal-item.entity';

@Injectable()
export class ProposalItemService {
  constructor(
    @InjectRepository(ProposalItem)
    private proposalItemRepository: Repository<ProposalItem>,
  ) { }

  async create(body: ProposalItem): Promise<ProposalItem> {
    body.itemId = body.item.id;

    const proposalItem = this.proposalItemRepository.create(body);

    return await this.proposalItemRepository.save(proposalItem);
  }

  async findAll(page: number = 1, limit: number = 10, search?: string): Promise<{ proposalItems: ProposalItem[]; total: number }> {
    const skip = (page - 1) * limit;
    const where = search
      ? [
        { item: Like(`%${search}%`) },
        { description: Like(`%${search}%`) },
        { code: Like(`%${search}%`) }
      ]
      : {};

    const [proposalItems, total] = await this.proposalItemRepository.findAndCount({
      where,
      skip,
      take: limit,
      order: { id: 'DESC' },
    });

    return { proposalItems: proposalItems, total };
  }

  async findById(id: number): Promise<ProposalItem> {
    const proposalItem = await this.proposalItemRepository.findOne({ where: { id } });

    if (!proposalItem) {
      throw new NotFoundException('Item da Proposta não encontrado');
    }

    return proposalItem;
  }

  async findByProposalId(id: number): Promise<ProposalItem[]> {
    const proposalItems = await this.proposalItemRepository.find({ where: { proposalId: id } });

    if (!proposalItems) {
      throw new NotFoundException('Itens de Proposta não encontrado');
    }

    return proposalItems;
  }

  async update(id: number, body: ProposalItem): Promise<ProposalItem> {
    await this.proposalItemRepository.update(id, body);

    return this.findById(id);
  }

  async remove(id: number): Promise<void> {
    const proposalItem = await this.findById(id);

    await this.proposalItemRepository.remove(proposalItem);
  }

  async count(): Promise<number> {
    return this.proposalItemRepository.count();
  }
}