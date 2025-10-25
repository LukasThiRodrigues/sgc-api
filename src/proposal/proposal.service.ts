import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Proposal } from './proposal.entity';
import { ItemService } from 'src/item/item.service';
import { SupplierService } from 'src/supplier/supplier.service';
import { ProposalItemService } from 'src/proposal-item/proposal-item.service';

@Injectable()
export class ProposalService {
  constructor(
    @InjectRepository(Proposal)
    private proposalRepository: Repository<Proposal>,
    private proposalItemService: ProposalItemService,
    private itemService: ItemService,
    private supplierService: SupplierService,
  ) { }

  async create(body: Proposal): Promise<Proposal> {
    const proposal = this.proposalRepository.create(body);

    await this.proposalRepository.save(proposal);

    for (const item of body.itens) {
      item.proposalId = proposal.id

      await this.proposalItemService.create(item);
    }

    return proposal;
  }

  async findAll(page: number = 1, limit: number = 10, supplierId?: number): Promise<{ proposals: Proposal[]; total: number }> {
    const skip = (page - 1) * limit;
    let where;

    if (supplierId) {
      where = {
        supplierId
      }
    }

    const [proposals, total] = await this.proposalRepository.findAndCount({
      where,
      skip,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    for (const proposal of proposals) {
      proposal.supplier = await this.supplierService.findById(proposal.supplierId);
    }

    return { proposals: proposals, total };
  }

  async findById(id: number): Promise<Proposal> {
    const proposal = await this.proposalRepository.findOne({ where: { id } });

    if (!proposal) {
      throw new NotFoundException('Proposta não encontrada');
    }

    proposal.itens = await this.proposalItemService.findByProposalId(proposal.id);
    proposal.supplier = await this.supplierService.findById(proposal.supplierId);

    for (const proposalItem of proposal.itens) {
      proposalItem.item = await this.itemService.findById(proposalItem.itemId);
    }

    return proposal;
  }

  async findByQuotationId(quotationId: number): Promise<Proposal[]> {
    const where = {
      quotationId
    };
    const proposals = await this.proposalRepository.find({
      where,
      order: { createdAt: 'DESC' },
    });

    for (const proposal of proposals) {
      proposal.supplier = await this.supplierService.findById(proposal.supplierId);
      proposal.itens = await this.proposalItemService.findByProposalId(proposal.id);

      for (const proposalItem of proposal.itens) {
        proposalItem.item = await this.itemService.findById(proposalItem.itemId);
      }
    }

    return proposals;
  }

  async update(id: number, body: Proposal): Promise<Proposal> {
    if (body.itens) {
      delete (body as any).itens;
    }

    if (body.supplier) {
      delete (body as any).supplier;
    }

    await this.proposalRepository.update(id, body);

    return this.findById(id);
  }

  async remove(id: number): Promise<void> {
    const proposal = await this.findById(id);

    await this.proposalRepository.remove(proposal);
  }

  async count(): Promise<number> {
    return this.proposalRepository.count();
  }
}