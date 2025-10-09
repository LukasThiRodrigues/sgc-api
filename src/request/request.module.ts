import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RequestService } from './request.service';
import { Request } from './request.entity';
import { RequestController } from './request.controller';
import { RequestItemModule } from 'src/request-item/request-item.module';
import { UserModule } from 'src/user/user.module';
import { SupplierModule } from 'src/supplier/supplier.module';
import { ItemModule } from 'src/item/item.module';

@Module({
    imports: [TypeOrmModule.forFeature([Request]), RequestItemModule, UserModule, SupplierModule, ItemModule],
    providers: [RequestService],
    controllers: [RequestController],
    exports: [RequestService, TypeOrmModule],
})
export class RequestModule { }