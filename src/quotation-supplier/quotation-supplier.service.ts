import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { QuotationSupplier } from './quotation-supplier.entity';

@Injectable()
export class QuotationSupplierService {
  constructor(
    @InjectRepository(QuotationSupplier)
    private quotationSupplierRepository: Repository<QuotationSupplier>,
  ) { }

  async create(body: QuotationSupplier): Promise<QuotationSupplier> {
    body.supplierId = body.supplier.id;

    const quotationSupplier = this.quotationSupplierRepository.create(body);

    return await this.quotationSupplierRepository.save(quotationSupplier);
  }

  async findAll(page: number = 1, limit: number = 10, search?: string): Promise<{ quotationSuppliers: QuotationSupplier[]; total: number }> {
    const skip = (page - 1) * limit;
    const where = search ? search : {};

    const [quotationSuppliers, total] = await this.quotationSupplierRepository.findAndCount({
      where,
      skip,
      take: limit,
      order: { id: 'DESC' },
    });

    return { quotationSuppliers: quotationSuppliers, total };
  }

  async findById(id: number): Promise<QuotationSupplier> {
    const quotationSupplier = await this.quotationSupplierRepository.findOne({ where: { id } });

    if (!quotationSupplier) {
      throw new NotFoundException('Fornecedor da Cotação não encontrado');
    }

    return quotationSupplier;
  }

  async findByQuotationId(id: number): Promise<QuotationSupplier[]> {
    const quotationSuppliers = await this.quotationSupplierRepository.find({ where: { quotationId: id } });

    if (!quotationSuppliers) {
      throw new NotFoundException('Fornecedores de Cotação não encontrado');
    }

    return quotationSuppliers;
  }

  async update(id: number, body: QuotationSupplier): Promise<QuotationSupplier> {
    await this.quotationSupplierRepository.update(id, body);

    return this.findById(id);
  }

  async remove(id: number): Promise<void> {
    const request = await this.findById(id);

    await this.quotationSupplierRepository.remove(request);
  }

  async count(): Promise<number> {
    return this.quotationSupplierRepository.count();
  }
}