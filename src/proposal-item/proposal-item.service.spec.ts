import { Test, TestingModule } from '@nestjs/testing';
import { ProposalItemService } from './proposal-item.service';
import { ProposalItem } from './proposal-item.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { mockProposalItem } from 'src/tests/factories/mock-proposal-item.factory';

const mockRepository = () => ({
    create: jest.fn(),
    save: jest.fn(),
    findAndCount: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    count: jest.fn(),
});

describe('ProposalItemService', () => {
    let service: ProposalItemService;
    let repo: jest.Mocked<Repository<ProposalItem>>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ProposalItemService,
                {
                    provide: getRepositoryToken(ProposalItem),
                    useValue: mockRepository(),
                },
            ],
        }).compile();

        service = module.get(ProposalItemService);
        repo = module.get(getRepositoryToken(ProposalItem));

        jest.clearAllMocks();
    });

    describe('create', () => {
        it('deve criar um item de proposta', async () => {
            const dto = mockProposalItem();

            repo.create.mockReturnValue(dto);
            repo.save.mockResolvedValue({ ...dto, id: 5 });

            const result = await service.create(dto);

            expect(dto.itemId).toBe(dto.item.id);
            expect(repo.create).toHaveBeenCalledWith(dto);
            expect(repo.save).toHaveBeenCalled();
            expect(result.id).toBe(5);
        });
    });

    describe('findAll', () => {
        it('deve retornar itens paginados', async () => {
            const items = [mockProposalItem(), mockProposalItem({ id: 2 })];

            repo.findAndCount.mockResolvedValue([items, 2]);

            const result = await service.findAll(1, 10);

            expect(result.total).toBe(2);
            expect(result.proposalItems.length).toBe(2);
        });

        it('deve aplicar filtro quando search for enviado', async () => {
            repo.findAndCount.mockResolvedValue([[], 0]);

            await service.findAll(1, 10, 'abc');

            expect(repo.findAndCount).toHaveBeenCalledWith(
                expect.objectContaining({
                    where: [
                        { item: Like('%abc%') },
                        { description: Like('%abc%') },
                        { code: Like('%abc%') },
                    ],
                }),
            );
        });
    });

    describe('findById', () => {
        it('deve retornar item pelo id', async () => {
            const item = mockProposalItem();

            repo.findOne.mockResolvedValue(item);

            const result = await service.findById(1);

            expect(result).toEqual(item);
        });

        it('deve lançar erro se não existir', async () => {
            repo.findOne.mockResolvedValue(null);

            await expect(service.findById(1)).rejects.toThrow(NotFoundException);
        });
    });

    describe('findByProposalId', () => {
        it('deve retornar itens da proposta', async () => {
            const items = [mockProposalItem()];

            repo.find.mockResolvedValue(items);

            const result = await service.findByProposalId(10);

            expect(result).toEqual(items);
        });

        it('deve lançar erro se retorno for null', async () => {
            repo.find.mockResolvedValue(null as any);

            await expect(service.findByProposalId(10)).rejects.toThrow(NotFoundException);
        });
    });

    describe('update', () => {
        it('deve atualizar o item e retornar o novo', async () => {
            const updated = mockProposalItem();

            repo.update.mockResolvedValue({ affected: 1 } as any);
            repo.findOne.mockResolvedValue(updated);

            const result = await service.update(1, updated);

            expect(repo.update).toHaveBeenCalledWith(1, updated);
            expect(result).toEqual(updated);
        });
    });

    describe('remove', () => {
        it('deve remover o item', async () => {
            const item = mockProposalItem();

            repo.findOne.mockResolvedValue(item);
            repo.remove.mockResolvedValue(undefined as any);

            await service.remove(1);

            expect(repo.remove).toHaveBeenCalledWith(item);
        });
    });

    describe('count', () => {
        it('deve retornar total de itens', async () => {
            repo.count.mockResolvedValue(5);

            const result = await service.count();

            expect(result).toBe(5);
        });
    });
});
