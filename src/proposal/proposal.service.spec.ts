import { Test, TestingModule } from '@nestjs/testing';
import { ProposalService } from './proposal.service';
import { Proposal } from './proposal.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProposalItemService } from 'src/proposal-item/proposal-item.service';
import { ItemService } from 'src/item/item.service';
import { SupplierService } from 'src/supplier/supplier.service';
import { Request } from 'src/request/request.entity';
import { NotFoundException } from '@nestjs/common';

const mockRepository = () => ({
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    findAndCount: jest.fn(),
    find: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    count: jest.fn(),
});

const mockProposalItemService = {
    create: jest.fn(),
    findByProposalId: jest.fn(),
};

const mockItemService = {
    findById: jest.fn(),
};

const mockSupplierService = {
    findById: jest.fn(),
};

describe('ProposalService', () => {
    let service: ProposalService;
    let proposalRepository: jest.Mocked<Repository<Proposal>>;
    let requestRepository: jest.Mocked<Repository<Request>>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ProposalService,

                {
                    provide: getRepositoryToken(Proposal),
                    useValue: mockRepository(),
                },
                {
                    provide: getRepositoryToken(Request),
                    useValue: mockRepository(),
                },
                { provide: ProposalItemService, useValue: mockProposalItemService },
                { provide: ItemService, useValue: mockItemService },
                { provide: SupplierService, useValue: mockSupplierService },
            ],
        }).compile();

        service = module.get<ProposalService>(ProposalService);
        proposalRepository = module.get(getRepositoryToken(Proposal));
        requestRepository = module.get(getRepositoryToken(Request));

        jest.clearAllMocks();
    });

    describe('create', () => {
        it('deve criar uma proposta e seus itens', async () => {
            const body: any = {
                itens: [{ itemId: 1 }],
            };

            const createdProposal = { id: 10, itens: [] } as any;

            proposalRepository.create.mockReturnValue(createdProposal);
            proposalRepository.save.mockResolvedValue(createdProposal);

            const result = await service.create(body as Proposal);

            expect(proposalRepository.create).toHaveBeenCalledWith(body);
            expect(proposalRepository.save).toHaveBeenCalledWith(createdProposal);

            expect(mockProposalItemService.create).toHaveBeenCalled();

            expect(result).toEqual(createdProposal);
        });
    });

    describe('findAll', () => {
        it('deve retornar propostas com total', async () => {
            const proposals = [{ id: 1, supplierId: 2 }] as Proposal[];

            proposalRepository.findAndCount.mockResolvedValue([proposals, 1]);
            mockSupplierService.findById.mockResolvedValue({ id: 2, name: 'SUP' });

            const result = await service.findAll(1, 10);

            expect(result).toEqual({
                proposals,
                total: 1,
            });
        });
    });

    describe('findById', () => {
        it('deve retornar proposta pelo id', async () => {
            const proposal = { id: 1, supplierId: 2 } as Proposal;

            proposalRepository.findOne.mockResolvedValue(proposal);
            mockProposalItemService.findByProposalId.mockResolvedValue([]);
            mockSupplierService.findById.mockResolvedValue({ id: 2 });
            mockItemService.findById.mockResolvedValue({});

            const result = await service.findById(1);

            expect(result).toEqual(proposal);
        });

        it('deve lançar erro se proposta não existir', async () => {
            proposalRepository.findOne.mockResolvedValue(null);

            await expect(service.findById(1)).rejects.toThrow(NotFoundException);
        });
    });

    describe('findByQuotationId', () => {
        it('deve buscar propostas por quotationId', async () => {
            const proposals = [{ id: 1, supplierId: 2 }] as Proposal[];

            proposalRepository.find.mockResolvedValue(proposals);
            mockSupplierService.findById.mockResolvedValue({ id: 2 });
            mockProposalItemService.findByProposalId.mockResolvedValue([]);
            requestRepository.findOne.mockResolvedValue(null);
            mockItemService.findById.mockResolvedValue({});

            const result = await service.findByQuotationId(99);

            expect(result).toEqual(proposals);
        });
    });

    describe('update', () => {
        it('deve atualizar a proposta', async () => {
            const updatedProposal = { id: 1 } as Proposal;

            proposalRepository.update.mockResolvedValue({ affected: 1 } as any);
            jest.spyOn(service, 'findById').mockResolvedValue(updatedProposal);

            const result = await service.update(1, { field: 'x' } as any);

            expect(result).toEqual(updatedProposal);
        });
    });

    describe('remove', () => {
        it('deve remover proposta', async () => {
            const proposal = { id: 1 } as Proposal;

            jest.spyOn(service, 'findById').mockResolvedValue(proposal);
            proposalRepository.remove.mockResolvedValue(proposal);

            await service.remove(1);

            expect(proposalRepository.remove).toHaveBeenCalledWith(proposal);
        });
    });

    describe('count', () => {
        it('deve retornar total de propostas', async () => {
            proposalRepository.count.mockResolvedValue(10);

            const result = await service.count();

            expect(result).toBe(10);
        });
    });
});
