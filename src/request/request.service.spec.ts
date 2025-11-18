import { Test, TestingModule } from '@nestjs/testing';
import { RequestService } from './request.service';
import { Repository } from 'typeorm';
import { Request, RequestStatus } from './request.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { RequestItemService } from 'src/request-item/request-item.service';
import { UserService } from 'src/user/user.service';
import { SupplierService } from 'src/supplier/supplier.service';
import { ItemService } from 'src/item/item.service';
import { QuotationService } from 'src/quotation/quotation.service';

describe('RequestService', () => {
  let service: RequestService;
  let repo: jest.Mocked<Repository<Request>>;
  let requestItemService: any;
  let userService: any;
  let supplierService: any;
  let itemService: any;
  let quotationService: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RequestService,
        {
          provide: getRepositoryToken(Request),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
            count: jest.fn(),
            findOne: jest.fn(),
            createQueryBuilder: jest.fn(),
          },
        },
        { provide: RequestItemService, useValue: { create: jest.fn(), findByRequestId: jest.fn() } },
        { provide: UserService, useValue: { findById: jest.fn() } },
        { provide: SupplierService, useValue: { findById: jest.fn() } },
        { provide: ItemService, useValue: { findById: jest.fn() } },
        { provide: QuotationService, useValue: { findById: jest.fn() } },
      ],
    })
      .overrideProvider('RequestItemService')
      .useValue({ create: jest.fn(), findByRequestId: jest.fn() })
      .overrideProvider('UserService')
      .useValue({ findById: jest.fn() })
      .overrideProvider('SupplierService')
      .useValue({ findById: jest.fn() })
      .overrideProvider('ItemService')
      .useValue({ findById: jest.fn() })
      .overrideProvider('QuotationService')
      .useValue({ findById: jest.fn() })
      .compile();

    service = module.get<RequestService>(RequestService);
    repo = module.get(getRepositoryToken(Request));
    requestItemService = module.get(RequestItemService);
    userService = module.get(UserService);
    supplierService = module.get(SupplierService);
    itemService = module.get(ItemService);
    quotationService = module.get(QuotationService);
  });

  it('deve criar um request com itens', async () => {
    const body: any = {
      creator: { id: 1 },
      supplier: { id: 2 },
      itens: [{ id: 99 }],
    };

    const qb: any = {
      select: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      getOne: jest.fn().mockResolvedValue({ code: '5' }),
    };

    repo.createQueryBuilder.mockReturnValue(qb);
    repo.findOne.mockResolvedValue(null);
    repo.create.mockReturnValue(body);
    repo.save.mockResolvedValue(body);
    requestItemService.create.mockResolvedValue(null);

    const result = await service.create(body);

    expect(result).toBe(body);
    expect(repo.create).toHaveBeenCalled();
    expect(repo.save).toHaveBeenCalled();
    expect(requestItemService.create).toHaveBeenCalledTimes(1);
  });

  it('deve lançar erro ao criar com código existente', async () => {
    const body: any = {
      creator: { id: 1 },
      supplier: { id: 2 },
      code: '10',
      itens: [],
    };

    repo.findOne.mockResolvedValue({ id: 1, code: '10' } as any);

    await expect(service.create(body)).rejects.toThrow(BadRequestException);
  });

  it('findByCode deve retornar null quando não encontrar', async () => {
    repo.findOne.mockResolvedValue(null);
    const result = await service.findByCode('ABC');
    expect(result).toBeNull();
  });

  it('findById deve retornar a request completa', async () => {
    const req: any = {
      id: 1,
      creatorId: 10,
      supplierId: 20,
      itens: [],
    };

    repo.findOne.mockResolvedValue(req);
    userService.findById.mockResolvedValue({ id: 10 });
    supplierService.findById.mockResolvedValue({ id: 20 });
    requestItemService.findByRequestId.mockResolvedValue([]);
    repo.update = jest.fn();

    const result = await service.findById(1);

    expect(result.creator.id).toBe(10);
    expect(result.supplier.id).toBe(20);
  });

  it('findById deve lançar erro se não existir', async () => {
    repo.findOne.mockResolvedValue(null);
    await expect(service.findById(99)).rejects.toThrow(NotFoundException);
  });

  it('findAll deve retornar lista e total', async () => {
    const qb: any = {
      orderBy: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      take: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      getManyAndCount: jest.fn().mockResolvedValue([[{ id: 1, creatorId: 1, supplierId: 2 }], 1]),
    };

    repo.createQueryBuilder.mockReturnValue(qb);
    userService.findById.mockResolvedValue({ id: 1 });
    supplierService.findById.mockResolvedValue({ id: 2 });

    const result = await service.findAll(1, 10);

    expect(result.total).toBe(1);
    expect(result.requests[0].creator.id).toBe(1);
  });

  it('update deve chamar update no repo e retornar o request atualizado', async () => {
    const updated = { id: 1 };

    repo.update.mockResolvedValue(null as any);
    repo.findOne.mockResolvedValue(updated as any);
    userService.findById.mockResolvedValue({});
    supplierService.findById.mockResolvedValue({});
    requestItemService.findByRequestId.mockResolvedValue([]);

    const result = await service.update(1, { description: 'X' } as any);

    expect(repo.update).toHaveBeenCalled();
    expect(result.id).toBe(1);
  });

  it('remove deve deletar o request', async () => {
    const req: any = { id: 1 };

    repo.findOne.mockResolvedValue(req);
    userService.findById.mockResolvedValue({});
    supplierService.findById.mockResolvedValue({});
    requestItemService.findByRequestId.mockResolvedValue([]);
    repo.remove.mockResolvedValue(null as any);

    await service.remove(1);

    expect(repo.remove).toHaveBeenCalledWith(req);
  });

  it('count deve retornar número total', async () => {
    repo.count.mockResolvedValue(5);
    const result = await service.count();
    expect(result).toBe(5);
  });
});
