import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Quotation } from './quotation.entity';
import { UserService } from 'src/user/user.service';
import { ItemService } from 'src/item/item.service';
import { QuotationItemService } from 'src/quotation-item/quotation-item.service';
import { QuotationSupplierService } from 'src/quotation-supplier/quotation-supplier.service';
import { SupplierService } from 'src/supplier/supplier.service';

@Injectable()
export class QuotationService {
  constructor(
    @InjectRepository(Quotation)
    private quotationRepository: Repository<Quotation>,
    private quotationItemService: QuotationItemService,
    private quotationSupplierService: QuotationSupplierService,
    private userService: UserService,
    private itemService: ItemService,
    private supplierService: SupplierService,
  ) { }

  async create(body: Quotation): Promise<Quotation> {
    body.creatorId = body.creator.id;

    const existingCode = await this.findByCode(body.code);

    if (existingCode) {
      throw new BadRequestException('Código já existe');
    }

    const quotation = this.quotationRepository.create(body);

    await this.quotationRepository.save(quotation);

    for (const item of body.itens) {
      item.quotationId = quotation.id

      await this.quotationItemService.create(item);
    }

    for (const supplier of body.suppliers) {
      supplier.quotationId = quotation.id

      await this.quotationSupplierService.create(supplier);
    }

    return quotation;
  }

  async findAll(page: number = 1, limit: number = 10, search?: string): Promise<{ quotations: Quotation[]; total: number }> {
    const skip = (page - 1) * limit;
    const where = search
      ? [
        { code: Like(`%${search}%`) },
        { description: Like(`%${search}%`) },
      ]
      : {};

    const [quotations, total] = await this.quotationRepository.findAndCount({
      where,
      skip,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    for (const quotation of quotations) {
      quotation.creator = await this.userService.findById(quotation.creatorId);
    }

    return { quotations: quotations, total };
  }

  async findByCode(code: string): Promise<Quotation | null> {
    return this.quotationRepository.findOne({ where: { code } });
  }

  async findById(id: number): Promise<Quotation> {
    const quotation = await this.quotationRepository.findOne({ where: { id } });

    if (!quotation) {
      throw new NotFoundException('Cotação não encontrada');
    }

    quotation.creator = await this.userService.findById(quotation.creatorId);
    quotation.itens = await this.quotationItemService.findByQuotationId(quotation.id);
    quotation.suppliers = await this.quotationSupplierService.findByQuotationId(quotation.id);

    for (const quotationItem of quotation.itens) {
      quotationItem.item = await this.itemService.findById(quotationItem.itemId);
    }

    for (const quotationSupplier of quotation.suppliers) {
      quotationSupplier.supplier = await this.supplierService.findById(quotationSupplier.supplierId);
    }

    return quotation;
  }

  async update(id: number, body: Quotation): Promise<Quotation> {
    if (body.creator && body.creator.id) {
      body.creatorId = body.creator.id;
      delete (body as any).creator;
    }

    if (body.itens) {
      delete (body as any).itens;
    }

    if (body.suppliers) {
      delete (body as any).suppliers;
    }

    await this.quotationRepository.update(id, body);

    return this.findById(id);
  }

  async remove(id: number): Promise<void> {
    const request = await this.findById(id);

    await this.quotationRepository.remove(request);
  }

  async count(): Promise<number> {
    return this.quotationRepository.count();
  }
}