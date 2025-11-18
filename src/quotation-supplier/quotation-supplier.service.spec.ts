import { Test, TestingModule } from '@nestjs/testing';
import { QuotationSupplierService } from './quotation-supplier.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QuotationSupplier } from './quotation-supplier.entity';
import { NotFoundException } from '@nestjs/common';

describe('QuotationSupplierService', () => {
    let service: QuotationSupplierService;
    let repo: jest.Mocked<Repository<QuotationSupplier>>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                QuotationSupplierService,
                {
                    provide: getRepositoryToken(QuotationSupplier),
                    useValue: {
                        create: jest.fn(),
                        save: jest.fn(),
                        findAndCount: jest.fn(),
                        find: jest.fn(),
                        findOne: jest.fn(),
                        update: jest.fn(),
                        remove: jest.fn(),
                        count: jest.fn(),
                    },
                },
            ],
        }).compile();

        service = module.get<QuotationSupplierService>(QuotationSupplierService);
        repo = module.get(getRepositoryToken(QuotationSupplier));
    });

    it('deve criar um fornecedor da cotação', async () => {
        const body = {
            supplier: { id: 10 },
            quotationId: 1,
        } as any;

        repo.create.mockReturnValue(body);
        repo.save.mockResolvedValue(body);

        const result = await service.create(body);

        expect(repo.create).toHaveBeenCalledWith(body);
        expect(repo.save).toHaveBeenCalledWith(body);
        expect(result).toBe(body);
    });

    it('deve retornar lista paginada', async () => {
        const expected = [[{ id: 1 }], 1];
        repo.findAndCount.mockResolvedValueOnce(expected as any);

        const result = await service.findAll(1, 10);

        expect(repo.findAndCount).toHaveBeenCalled();
        expect(result.quotationSuppliers.length).toBe(1);
        expect(result.total).toBe(1);
    });

    it('deve retornar fornecedor da cotação pelo ID', async () => {
        repo.findOne.mockResolvedValueOnce({ id: 1 } as any);

        const result = await service.findById(1);

        expect(repo.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
        expect(result).toEqual({ id: 1 });
    });

    it('deve lançar erro se não encontrar fornecedor por ID', async () => {
        repo.findOne.mockResolvedValueOnce(null);

        await expect(service.findById(99)).rejects.toThrow(NotFoundException);
    });

    it('deve retornar fornecedores por quotationId', async () => {
        repo.find.mockResolvedValueOnce([{ id: 1, quotationId: 5 }] as any);

        const result = await service.findByQuotationId(5);

        expect(repo.find).toHaveBeenCalledWith({ where: { quotationId: 5 } });
        expect(result.length).toBe(1);
    });

    it('deve atualizar fornecedor por ID', async () => {
        repo.update.mockResolvedValueOnce(undefined as any);
        repo.findOne.mockResolvedValueOnce({ id: 1 } as any);

        const result = await service.update(1, { status: 'ATIVO' } as any);

        expect(repo.update).toHaveBeenCalledWith(1, { status: 'ATIVO' });
        expect(result).toEqual({ id: 1 });
    });

    it('deve remover fornecedor da cotação', async () => {
        repo.findOne.mockResolvedValueOnce({ id: 1 } as any);
        repo.remove.mockResolvedValueOnce(undefined as any);

        await service.remove(1);

        expect(repo.remove).toHaveBeenCalledWith({ id: 1 });
    });

    it('deve retornar count', async () => {
        repo.count.mockResolvedValueOnce(3);

        const result = await service.count();

        expect(result).toBe(3);
    });
});
