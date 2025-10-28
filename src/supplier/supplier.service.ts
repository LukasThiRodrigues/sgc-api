import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Supplier } from './supplier.entity';

@Injectable()
export class SupplierService {
  constructor(
    @InjectRepository(Supplier)
    private supplierRepository: Repository<Supplier>,
  ) { }

  async create(body: Supplier): Promise<Supplier> {
    body.creatorId = body.creator.id;

    const existingCnpj = await this.findByCnpj(body.cnpj);

    if (existingCnpj) {
      throw new BadRequestException('CNPJ já existe');
    }

    const supplier = this.supplierRepository.create(body);

    return await this.supplierRepository.save(supplier);
  }

  async findAll(page: number = 1, limit: number = 10, search?: string, userId?: number): Promise<{ suppliers: Supplier[]; total: number }> {
    const skip = (page - 1) * limit;
    const query = this.supplierRepository
      .createQueryBuilder('supplier')
      .orderBy('supplier.createdAt', 'DESC')
      .skip(skip)
      .take(limit);

    if (search) {
      query.andWhere('(supplier.name LIKE :search OR supplier.cnpj LIKE :search)', {
        search: `%${search}%`,
      });
    }

    if (userId) {
      query.andWhere('supplier.creatorId = :userId', { userId });
    }

    const [suppliers, total] = await query.getManyAndCount();

    return { suppliers: suppliers, total };
  }

  async findByCnpj(cnpj: string): Promise<Supplier | null> {
    return this.supplierRepository.findOne({ where: { cnpj } });
  }

  async findById(id: number): Promise<Supplier> {
    const supplier = await this.supplierRepository.findOne({ where: { id } });

    if (!supplier) {
      throw new NotFoundException('Fornecedor não encontrado');
    }

    return supplier;
  }

  async update(id: number, body: Supplier): Promise<Supplier> {
    const oldSupplier = await this.findById(id);

    if (body.cnpj && body.cnpj !== oldSupplier.cnpj) {
      const existingSupplier = await this.findByCnpj(body.cnpj);

      if (existingSupplier) {
        throw new BadRequestException('CNPJ já está em uso');
      }
    }

    await this.supplierRepository.update(id, body);

    return this.findById(id);
  }

  async remove(id: number): Promise<void> {
    const supplier = await this.findById(id);

    await this.supplierRepository.remove(supplier);
  }

  async count(): Promise<number> {
    return this.supplierRepository.count();
  }
}