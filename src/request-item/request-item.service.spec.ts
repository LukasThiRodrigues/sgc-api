import { Test, TestingModule } from '@nestjs/testing';
import { RequestItemService } from './request-item.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { RequestItem } from './request-item.entity';
import { NotFoundException } from '@nestjs/common';

describe('RequestItemService', () => {
    let service: RequestItemService;
    let repo: jest.Mocked<any>;

    beforeEach(async () => {
        repo = {
            create: jest.fn(),
            save: jest.fn(),
            findAndCount: jest.fn(),
            findOne: jest.fn(),
            find: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
            count: jest.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                RequestItemService,
                {
                    provide: getRepositoryToken(RequestItem),
                    useValue: repo,
                },
            ],
        }).compile();

        service = module.get<RequestItemService>(RequestItemService);
    });

    it('deve criar um requestItem', async () => {
        const body = { itemId: 1 };
        const created = { id: 10, itemId: 1 };

        repo.create.mockReturnValue(body);
        repo.save.mockResolvedValue(created);

        const result = await service.create(body as any);

        expect(repo.create).toHaveBeenCalledWith(body);
        expect(repo.save).toHaveBeenCalledWith(body);
        expect(result).toEqual(created);
    });

    it('findAll deve retornar lista e total', async () => {
        const items = [{ id: 1 }, { id: 2 }];
        repo.findAndCount.mockResolvedValue([items, 2]);

        const result = await service.findAll(1, 10);

        expect(result).toEqual({ requestItems: items, total: 2 });
    });

    it('findById deve retornar um item', async () => {
        const item = { id: 1 };
        repo.findOne.mockResolvedValue(item);

        const result = await service.findById(1);

        expect(result).toEqual(item);
    });

    it('findById deve lançar erro se não encontrar', async () => {
        repo.findOne.mockResolvedValue(null);

        await expect(service.findById(1)).rejects.toThrow(NotFoundException);
    });

    it('findByRequestId deve retornar itens', async () => {
        const items = [{ id: 1 }];
        repo.find.mockResolvedValue(items);

        const result = await service.findByRequestId(10);

        expect(result).toEqual(items);
    });

    it('findByRequestId deve lançar erro se não encontrar', async () => {
        repo.find.mockResolvedValue(null);

        await expect(service.findByRequestId(10)).rejects.toThrow(NotFoundException);
    });

    it('update deve atualizar e retornar o item', async () => {
        const updated = { id: 1 };
        repo.update.mockResolvedValue({});
        repo.findOne.mockResolvedValue(updated);

        const result = await service.update(1, updated as any);

        expect(repo.update).toHaveBeenCalledWith(1, updated);
        expect(result).toEqual(updated);
    });

    it('remove deve remover o item', async () => {
        const item = { id: 1 };
        repo.findOne.mockResolvedValue(item);
        repo.remove.mockResolvedValue({});

        await service.remove(1);

        expect(repo.remove).toHaveBeenCalledWith(item);
    });

    it('count deve retornar total', async () => {
        repo.count.mockResolvedValue(5);

        expect(await service.count()).toBe(5);
    });
});
