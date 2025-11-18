import { Test, TestingModule } from '@nestjs/testing';
import { SupplierService } from './supplier.service';
import { Supplier } from './supplier.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('SupplierService', () => {
    let service: SupplierService;
    let repo: any;
    let queryBuilder: any;

    beforeEach(async () => {
        queryBuilder = {
            orderBy: jest.fn().mockReturnThis(),
            skip: jest.fn().mockReturnThis(),
            take: jest.fn().mockReturnThis(),
            andWhere: jest.fn().mockReturnThis(),
            getManyAndCount: jest.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                SupplierService,
                {
                    provide: getRepositoryToken(Supplier),
                    useValue: {
                        create: jest.fn(),
                        save: jest.fn(),
                        update: jest.fn(),
                        remove: jest.fn(),
                        count: jest.fn(),
                        findOne: jest.fn(),
                        createQueryBuilder: jest.fn(() => queryBuilder),
                    },
                },
            ],
        }).compile();

        service = module.get<SupplierService>(SupplierService);
        repo = module.get(getRepositoryToken(Supplier));
    });

    it('deve criar um supplier quando CNPJ não existir', async () => {
        const body = {
            cnpj: '111',
            creator: { id: 10 },
        } as any;

        jest.spyOn(service, 'findByCnpj').mockResolvedValue(null);
        repo.create.mockImplementation((data) => data);
        repo.save.mockResolvedValue(body);

        const result = await service.create(body);

        expect(result).toEqual(body);
        expect(repo.save).toHaveBeenCalled();
    });

    it('deve lançar erro ao criar supplier com CNPJ duplicado', async () => {
        jest.spyOn(service, 'findByCnpj').mockResolvedValue({ id: 123 } as any);

        await expect(
            service.create({
                cnpj: '111',
                creator: { id: 1 },
            } as any),
        ).rejects.toThrow(BadRequestException);
    });

    it('findAll deve retornar lista e total', async () => {
        queryBuilder.getManyAndCount.mockResolvedValue([[{ id: 1 }], 1]);

        const result = await service.findAll(1, 10);

        expect(result).toEqual({
            suppliers: [{ id: 1 }],
            total: 1,
        });
    });

    it('findAll deve aplicar search', async () => {
        queryBuilder.getManyAndCount.mockResolvedValue([[], 0]);

        await service.findAll(1, 10, 'abc');

        expect(queryBuilder.andWhere).toHaveBeenCalledWith(
            '(supplier.name LIKE :search OR supplier.cnpj LIKE :search)',
            { search: '%abc%' },
        );
    });

    it('findAll deve filtrar por userId', async () => {
        queryBuilder.getManyAndCount.mockResolvedValue([[], 0]);

        await service.findAll(1, 10, undefined, 9);

        expect(queryBuilder.andWhere).toHaveBeenCalledWith(
            'supplier.creatorId = :userId',
            { userId: 9 },
        );
    });

    it('findByCnpj deve retornar um supplier', async () => {
        repo.findOne.mockResolvedValue({ id: 1 });

        const res = await service.findByCnpj('111');

        expect(res).toEqual({ id: 1 });
    });

    it('findByCnpj deve retornar null quando não existir', async () => {
        repo.findOne.mockResolvedValue(null);

        const res = await service.findByCnpj('111');

        expect(res).toBeNull();
    });

    it('findById deve retornar supplier existente', async () => {
        repo.findOne.mockResolvedValue({ id: 1 });

        const res = await service.findById(1);

        expect(res).toEqual({ id: 1 });
    });

    it('findById deve lançar erro se supplier não existir', async () => {
        repo.findOne.mockResolvedValue(null);

        await expect(service.findById(1)).rejects.toThrow(NotFoundException);
    });

    it('update deve atualizar supplier e retornar atualizado', async () => {
        const old = { id: 1, cnpj: '111' };
        const updated = { id: 1, cnpj: '111' };

        jest.spyOn(service, 'findById').mockResolvedValueOnce(old as any);
        jest.spyOn(service, 'findByCnpj').mockResolvedValue(null);
        jest.spyOn(service, 'findById').mockResolvedValueOnce(updated as any);

        repo.update.mockResolvedValue(undefined);

        const res = await service.update(1, updated as any);

        expect(res).toEqual(updated);
    });

    it('update deve lançar erro se CNPJ já existir', async () => {
        jest.spyOn(service, 'findById').mockResolvedValue({ id: 1, cnpj: '111' } as any);
        jest.spyOn(service, 'findByCnpj').mockResolvedValue({ id: 2 } as any);

        await expect(
            service.update(1, { cnpj: '222' } as any),
        ).rejects.toThrow(BadRequestException);
    });

    it('remove deve deletar supplier', async () => {
        jest.spyOn(service, 'findById').mockResolvedValue({ id: 1 } as any);
        repo.remove.mockResolvedValue(undefined);

        await service.remove(1);

        expect(repo.remove).toHaveBeenCalled();
    });

    it('count deve retornar número total', async () => {
        repo.count.mockResolvedValue(5);

        const result = await service.count();

        expect(result).toBe(5);
    });
});
