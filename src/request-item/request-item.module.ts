import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RequestItemService } from './request-item.service';
import { RequestItem } from './request-item.entity';
import { RequestItemController } from './request-item.controller';

@Module({
    imports: [TypeOrmModule.forFeature([RequestItem])],
    providers: [RequestItemService],
    controllers: [RequestItemController],
    exports: [RequestItemService, TypeOrmModule],
})
export class RequestItemModule { }