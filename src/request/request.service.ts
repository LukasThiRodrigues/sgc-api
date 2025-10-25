import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, Not, In } from 'typeorm';
import { Request, RequestStatus } from './request.entity';
import { RequestItemService } from 'src/request-item/request-item.service';
import { UserService } from 'src/user/user.service';
import { SupplierService } from 'src/supplier/supplier.service';
import { ItemService } from 'src/item/item.service';

@Injectable()
export class RequestService {
  constructor(
    @InjectRepository(Request)
    private requestRepository: Repository<Request>,
    private requestItemService: RequestItemService,
    private userService: UserService,
    private supplierService: SupplierService,
    private itemService: ItemService,
  ) { }

  async create(body: Request): Promise<Request> {
    body.creatorId = body.creator.id;
    body.supplierId = body.supplier.id;

    if (!body.code) {
      const lastRequest = await this.requestRepository
        .createQueryBuilder('request')
        .select('request.code')
        .orderBy('request.code', 'DESC')
        .getOne();

      let nextCode = 1;

      if (lastRequest && lastRequest.code) {
        const lastCodeNumber = parseInt(lastRequest.code, 10);
        if (!isNaN(lastCodeNumber)) {
          nextCode = lastCodeNumber + 1;
        }
      }

      body.code = String(nextCode);
    }

    const existingCode = await this.findByCode(body.code);

    if (existingCode) {
      throw new BadRequestException('Código já existe');
    }

    const request = this.requestRepository.create(body);

    await this.requestRepository.save(request);

    for (const item of body.itens) {
      item.requestId = request.id

      await this.requestItemService.create(item);
    }

    return request;
  }

  async findAll(page: number = 1, limit: number = 10, search?: string, supplierId?: number): Promise<{ requests: Request[]; total: number }> {
    const skip = (page - 1) * limit;
    let where;

    where = search
      ? [
        { code: Like(`%${search}%`) },
        { description: Like(`%${search}%`) },
      ]
      : {};

    if (supplierId) {
      where = {
        status: Not(In([RequestStatus.Canceled, RequestStatus.Draft])),
        supplierId
      }
    }

    const [requests, total] = await this.requestRepository.findAndCount({
      where,
      skip,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    for (const request of requests) {
      request.creator = await this.userService.findById(request.creatorId);
      request.supplier = await this.supplierService.findById(request.supplierId);
    }

    return { requests: requests, total };
  }

  async findByCode(code: string): Promise<Request | null> {
    return this.requestRepository.findOne({ where: { code } });
  }

  async findById(id: number): Promise<Request> {
    const request = await this.requestRepository.findOne({ where: { id } });

    if (!request) {
      throw new NotFoundException('Pedido não encontrado');
    }

    request.creator = await this.userService.findById(request.creatorId);
    request.supplier = await this.supplierService.findById(request.supplierId);
    request.itens = await this.requestItemService.findByRequestId(request.id);

    for (const requestItem of request.itens) {
      requestItem.item = await this.itemService.findById(requestItem.itemId);
    }

    return request;
  }

  async update(id: number, body: Request): Promise<Request> {
    if (body.supplier && body.supplier.id) {
      body.supplierId = body.supplier.id;
      delete (body as any).supplier;
    }

    if (body.creator && body.creator.id) {
      body.creatorId = body.creator.id;
      delete (body as any).creator;
    }

    if (body.itens) {
      delete (body as any).itens;
    }

    await this.requestRepository.update(id, body);

    return this.findById(id);
  }

  async remove(id: number): Promise<void> {
    const request = await this.findById(id);

    await this.requestRepository.remove(request);
  }

  async count(): Promise<number> {
    return this.requestRepository.count();
  }
}