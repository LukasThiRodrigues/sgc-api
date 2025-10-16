import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuotationService } from './quotation.service';
import { Quotation } from './quotation.entity';
import { QuotationController } from './quotation.controller';
import { UserModule } from 'src/user/user.module';
import { ItemModule } from 'src/item/item.module';
import { QuotationItemModule } from 'src/quotation-item/quotation-item.module';
import { QuotationSupplierModule } from 'src/quotation-supplier/quotation-supplier.module';
import { SupplierModule } from 'src/supplier/supplier.module';

@Module({
    imports: [TypeOrmModule.forFeature([Quotation]), QuotationItemModule, QuotationSupplierModule, UserModule, ItemModule, SupplierModule],
    providers: [QuotationService],
    controllers: [QuotationController],
    exports: [QuotationService, TypeOrmModule],
})
export class QuotationModule { }