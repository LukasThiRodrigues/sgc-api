import { Test, TestingModule } from '@nestjs/testing';
import { QuotationService } from './quotation.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Quotation } from './quotation.entity';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { QuotationItemService } from 'src/quotation-item/quotation-item.service';
import { QuotationSupplierService } from 'src/quotation-supplier/quotation-supplier.service';
import { UserService } from 'src/user/user.service';
import { ItemService } from 'src/item/item.service';
import { SupplierService } from 'src/supplier/supplier.service';
import { ProposalService } from 'src/proposal/proposal.service';

describe('QuotationService', () => {
    let service: QuotationService;
    let repo: jest.Mocked<Repository<Quotation>>;

    const mockUserService = { findById: jest.fn() };
    const mockItemService = { findById: jest.fn() };
    const mockQuotationItemService = { findByQuotationId: jest.fn(), create: jest.fn() };
    const mockQuotationSupplierService = { findByQuotationId: jest.fn(), create: jest.fn() };
    const mockSupplierService = { findById: jest.fn() };
    const mockProposalService = { findByQuotationId: jest.fn() };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                QuotationService,
                {
                    provide: getRepositoryToken(Quotation),
                    useValue: {
                        create: jest.fn(),
                        save: jest.fn(),
                        update: jest.fn(),
                        remove: jest.fn(),
                        findOne: jest.fn(),
                        count: jest.fn(),
                        createQueryBuilder: jest.fn().mockReturnValue({
                            leftJoinAndSelect: jest.fn().mockReturnThis(),
                            where: jest.fn().mockReturnThis(),
                            andWhere: jest.fn().mockReturnThis(),
                            orderBy: jest.fn().mockReturnThis(),
                            skip: jest.fn().mockReturnThis(),
                            take: jest.fn().mockReturnThis(),
                            getManyAndCount: jest.fn(),
                        }),
                    },
                },
                { provide: QuotationItemService, useValue: mockQuotationItemService },
                { provide: QuotationSupplierService, useValue: mockQuotationSupplierService },
                { provide: UserService, useValue: mockUserService },
                { provide: ItemService, useValue: mockItemService },
                { provide: SupplierService, useValue: mockSupplierService },
                { provide: ProposalService, useValue: mockProposalService },
            ],
        }).compile();

        service = module.get<QuotationService>(QuotationService);
        repo = module.get(getRepositoryToken(Quotation));
    });

    it('deve retornar a cotação pelo ID', async () => {
        repo.findOne.mockResolvedValueOnce({
            id: 1,
            creatorId: 10,
            itens: [],
            suppliers: [],
            proposals: []
        } as any);

        mockUserService.findById.mockResolvedValue({ id: 10 });
        mockQuotationItemService.findByQuotationId.mockResolvedValue([]);
        mockQuotationSupplierService.findByQuotationId.mockResolvedValue([]);
        mockProposalService.findByQuotationId.mockResolvedValue([]);

        const result = await service.findById(1);
        expect(result).toBeDefined();
        expect(repo.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('deve lançar erro se findById retornar null', async () => {
        repo.findOne.mockResolvedValueOnce(null as any);

        await expect(service.findById(99)).rejects.toThrow(NotFoundException);
    });


    it('deve buscar por código', async () => {
        repo.findOne.mockResolvedValueOnce({ id: 1 } as any);

        const result = await service.findByCode('ABC');
        expect(result).toBeDefined();
    });

    it('deve criar uma cotação', async () => {
        const body = {
            code: 'Q001',
            creator: { id: 5 },
            itens: [{ id: 1 }, { id: 2 }],
            suppliers: [{ id: 10 }, { id: 11 }]
        };

        repo.findOne.mockResolvedValue(null);
        repo.create.mockReturnValue(body as any);
        repo.save.mockResolvedValue(body as any);

        mockQuotationItemService.create.mockResolvedValue({});
        mockQuotationSupplierService.create.mockResolvedValue({});
        mockUserService.findById.mockResolvedValue({ id: 5 });

        const result = await service.create(body as any);

        expect(repo.create).toHaveBeenCalledWith(body);
        expect(repo.save).toHaveBeenCalledWith(body);
        expect(mockQuotationItemService.create).toHaveBeenCalledTimes(2);
        expect(mockQuotationSupplierService.create).toHaveBeenCalledTimes(2);

        expect(result).toBe(body);
    });


    it('deve lançar erro se o código já existir', async () => {
        repo.findOne.mockResolvedValueOnce({ code: 'COT001' } as any);

        const body: any = {
            code: 'COT001',
            creator: { id: 10 },
            itens: [],
            suppliers: [],
        };

        await expect(service.create(body)).rejects.toThrow(BadRequestException);
    });

    it('deve atualizar uma cotação', async () => {
        repo.update.mockResolvedValueOnce(undefined as any);

        repo.findOne.mockResolvedValueOnce({
            id: 1,
            creatorId: 10,
            itens: [],
            suppliers: [],
            proposals: []
        } as any);

        mockUserService.findById.mockResolvedValue({ id: 10 });
        mockQuotationItemService.findByQuotationId.mockResolvedValue([]);
        mockQuotationSupplierService.findByQuotationId.mockResolvedValue([]);
        mockProposalService.findByQuotationId.mockResolvedValue([]);

        const result = await service.update(1, { description: 'Nova' } as any);

        expect(repo.update).toHaveBeenCalled();
        expect(result).toBeDefined();
    });

    it('deve remover a cotação', async () => {
        repo.findOne.mockResolvedValueOnce({
            id: 1,
            creatorId: 10,
            itens: [],
            suppliers: [],
            proposals: []
        } as any);

        mockUserService.findById.mockResolvedValue({ id: 10 });
        mockQuotationItemService.findByQuotationId.mockResolvedValue([]);
        mockQuotationSupplierService.findByQuotationId.mockResolvedValue([]);
        mockProposalService.findByQuotationId.mockResolvedValue([]);

        repo.remove.mockResolvedValueOnce(undefined as any);

        await service.remove(1);

        expect(repo.remove).toHaveBeenCalled();
    });

    it('deve retornar o count', async () => {
        repo.count.mockResolvedValueOnce(5);
        expect(await service.count()).toBe(5);
    });
});
