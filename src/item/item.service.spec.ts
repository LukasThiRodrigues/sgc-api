import { Test, TestingModule } from '@nestjs/testing';
import { ItemService } from './item.service';
import { Item } from './item.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { mockItem } from 'src/tests/factories/mock-item.factory';

const queryBuilderMock = {
  orderBy: jest.fn().mockReturnThis(),
  skip: jest.fn().mockReturnThis(),
  take: jest.fn().mockReturnThis(),
  andWhere: jest.fn().mockReturnThis(),
  getManyAndCount: jest.fn(),
};

const mockRepository = () => ({
  create: jest.fn(),
  save: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
  count: jest.fn(),
  createQueryBuilder: jest.fn(() => queryBuilderMock),
});

describe('ItemService', () => {
    let service: ItemService;
    let repository: jest.Mocked<Repository<Item>>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ItemService,
                {
                    provide: getRepositoryToken(Item),
                    useValue: mockRepository(),
                },
            ],
        }).compile();

        service = module.get<ItemService>(ItemService);
        repository = module.get(getRepositoryToken(Item));
    });

    describe('create', () => {
        it('deve criar item se código não existir', async () => {
            const body = mockItem({ code: 'ABC123' });

            repository.findOne.mockResolvedValue(null);
            repository.create.mockReturnValue(body);
            repository.save.mockResolvedValue(body);

            const result = await service.create(body);

            expect(repository.findOne).toHaveBeenCalled();
            expect(repository.create).toHaveBeenCalledWith(body);
            expect(repository.save).toHaveBeenCalled();
            expect(result).toEqual(body);
        });

        it('deve lançar erro se código já existir', async () => {
            repository.findOne.mockResolvedValue(mockItem({ id: 99, code: 'ABC123' }));

            await expect(
                service.create(mockItem({ code: 'ABC123' })),
            ).rejects.toThrow(BadRequestException);
        });
    });

    describe('findById', () => {
        it('deve retornar item pelo id', async () => {
            const item = mockItem({ id: 1 });

            repository.findOne.mockResolvedValue(item);

            const result = await service.findById(1);

            expect(result).toEqual(item);
        });

        it('deve lançar erro se item não existir', async () => {
            repository.findOne.mockResolvedValue(null);

            await expect(service.findById(1)).rejects.toThrow(NotFoundException);
        });
    });

    describe('update', () => {
        it('deve atualizar item corretamente', async () => {
            const oldItem = mockItem({ id: 1, code: 'OLD' });
            const updatedItem = mockItem({ id: 1, code: 'NEW' });

            repository.findOne
                .mockResolvedValueOnce(oldItem)
                .mockResolvedValueOnce(null)
                .mockResolvedValueOnce(updatedItem);

            repository.update.mockResolvedValue({ affected: 1 } as any);

            const result = await service.update(1, { code: 'NEW' } as any);

            expect(result).toEqual(updatedItem);
        });

        it('deve lançar erro se novo código já existir', async () => {
            const oldItem = mockItem({ id: 1, code: 'OLD' });

            repository.findOne
                .mockResolvedValueOnce(oldItem)
                .mockResolvedValueOnce(mockItem({ id: 2, code: 'NEW' }));

            await expect(
                service.update(1, { code: 'NEW' } as any),
            ).rejects.toThrow(BadRequestException);
        });
    });

    describe('remove', () => {
        it('deve remover item', async () => {
            const item = mockItem({ id: 1 });

            repository.findOne.mockResolvedValue(item);
            repository.remove.mockResolvedValue(item);

            await service.remove(1);

            expect(repository.remove).toHaveBeenCalledWith(item);
        });

        it('deve lançar erro se item não existir', async () => {
            repository.findOne.mockResolvedValue(null);

            await expect(service.remove(1)).rejects.toThrow(NotFoundException);
        });
    });

    describe('findAll', () => {
        it('deve retornar itens e total', async () => {
            const items = [mockItem({ id: 1 }), mockItem({ id: 2 })];
            const total = 2;

            const qbMock = repository.createQueryBuilder() as any;
            qbMock.getManyAndCount.mockResolvedValue([items, total]);

            const result = await service.findAll(1, 10);

            expect(result).toEqual({ items, total });
        });
    });

    describe('count', () => {
        it('deve retornar total de itens', async () => {
            repository.count.mockResolvedValue(5);

            const result = await service.count();

            expect(result).toBe(5);
        });
    });
});
