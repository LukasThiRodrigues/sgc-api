import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { User } from './user.entity';
import { Supplier, SupplierStatus } from 'src/supplier/supplier.entity';
import * as bcrypt from 'bcryptjs';
import { BadRequestException, NotFoundException } from '@nestjs/common';

jest.mock('bcryptjs', () => ({
  hash: jest.fn().mockResolvedValue('hashedPass'),
}));

describe('UserService', () => {
  let service: UserService;
  let userRepo: any;
  let supplierRepo: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
            count: jest.fn(),
            findAndCount: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Supplier),
          useValue: {
            findOne: jest.fn(),
            update: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userRepo = module.get(getRepositoryToken(User));
    supplierRepo = module.get(getRepositoryToken(Supplier));
  });

  it('should create a new user', async () => {
    const dto = { email: 'test@test.com', password: '123', name: 'User' };

    jest.spyOn(service, 'findByEmail').mockResolvedValue(null);
    jest.spyOn(service, 'findContactSupplier').mockResolvedValue(null);

    jest.spyOn(bcrypt as any, 'hash').mockResolvedValue('hashedPass');

    userRepo.create.mockReturnValue({ id: 1, ...dto, password: 'hashedPass' });
    userRepo.save.mockResolvedValue({ id: 1, ...dto, password: 'hashedPass' });

    const result = await service.create(dto as any);

    expect(result).toEqual({
      id: 1,
      email: dto.email,
      name: dto.name,
      password: 'hashedPass',
    });
  });

  it('should not create if email already exists', async () => {
    jest.spyOn(service, 'findByEmail').mockResolvedValue({ id: 1 } as User);

    await expect(
      service.create({ email: 'test@test.com', password: '123' } as any),
    ).rejects.toThrow(BadRequestException);
  });

  it('should activate supplier if supplier contact email matches', async () => {
    const dto = { email: 'sup@test.com', password: '123', name: 'SupplierUser' };

    jest.spyOn(service, 'findByEmail').mockResolvedValue(null);

    const supplier = { id: 5 } as Supplier;

    jest.spyOn(service, 'findContactSupplier').mockResolvedValue(supplier);

    jest.spyOn(bcrypt as any, 'hash').mockResolvedValue('hashedPass');

    userRepo.create.mockReturnValue({
      id: 2,
      ...dto,
      supplierId: 5,
      password: 'hashedPass',
    });

    userRepo.save.mockResolvedValue({
      id: 2,
      ...dto,
      supplierId: 5,
      password: 'hashedPass',
    });

    const result = await service.create(dto as any);

    expect(supplierRepo.update).toHaveBeenCalledWith(5, { status: SupplierStatus.Active });
    expect(result.supplierId).toBe(5);
  });

  it('should return paginated users', async () => {
    const users = [{ id: 1 }, { id: 2 }] as User[];

    userRepo.findAndCount.mockResolvedValue([users, 2]);

    const result = await service.findAll(1, 10, 'test');

    expect(result).toEqual({ users, total: 2 });
  });

  it('should return user by email', async () => {
    userRepo.findOne.mockResolvedValue({ id: 1, email: 'test@test.com' });

    const result = await service.findByEmail('test@test.com');

    expect(result).toEqual({ id: 1, email: 'test@test.com' });
  });

  it('should throw if user not found', async () => {
    userRepo.findOne.mockResolvedValue(null);

    await expect(service.findById(99)).rejects.toThrow(NotFoundException);
  });

  it('should return user by id', async () => {
    userRepo.findOne.mockResolvedValue({ id: 1 });

    const result = await service.findById(1);

    expect(result).toEqual({ id: 1 });
  });

  it('should update user', async () => {
    const existing = { id: 1, email: 'old@test.com' } as User;

    jest.spyOn(service, 'findById').mockResolvedValue(existing);
    jest.spyOn(service, 'findByEmail').mockResolvedValue(null);

    jest.spyOn(bcrypt as any, 'hash').mockResolvedValue('hashedNew');

    userRepo.update.mockResolvedValue(undefined);
    jest.spyOn(service, 'findById').mockResolvedValue({
      id: 1,
      email: 'new@test.com',
      password: 'hashedNew',
    } as any);

    const result = await service.update(1, { email: 'new@test.com', password: 'abc' });

    expect(result).toEqual({
      id: 1,
      email: 'new@test.com',
      password: 'hashedNew',
    });
  });

  it('should prevent update if email already exists', async () => {
    jest.spyOn(service, 'findById').mockResolvedValue({
      id: 1,
      email: 'old@test.com',
    } as any);

    jest.spyOn(service, 'findByEmail').mockResolvedValue({ id: 2 } as User);

    await expect(
      service.update(1, { email: 'used@test.com' }),
    ).rejects.toThrow(BadRequestException);
  });

  it('should remove user', async () => {
    jest.spyOn(service, 'findById').mockResolvedValue({ id: 1 } as User);

    userRepo.remove.mockResolvedValue(undefined);

    await service.remove(1);

    expect(userRepo.remove).toHaveBeenCalled();
  });

  it('should return total user count', async () => {
    userRepo.count.mockResolvedValue(10);

    const result = await service.count();

    expect(result).toBe(10);
  });
});
