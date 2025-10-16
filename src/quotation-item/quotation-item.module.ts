import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuotationItemService } from './quotation-item.service';
import { QuotationItem } from './quotation-item.entity';
import { QuotationItemController } from './quotation-item.controller';

@Module({
    imports: [TypeOrmModule.forFeature([QuotationItem])],
    providers: [QuotationItemService],
    controllers: [QuotationItemController],
    exports: [QuotationItemService, TypeOrmModule],
})
export class QuotationItemModule { }