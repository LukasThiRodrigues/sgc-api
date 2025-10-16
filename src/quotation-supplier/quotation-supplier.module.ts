import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuotationSupplierService } from './quotation-supplier.service';
import { QuotationSupplier } from './quotation-supplier.entity';
import { QuotationSupplierController } from './quotation-supplier.controller';

@Module({
    imports: [TypeOrmModule.forFeature([QuotationSupplier])],
    providers: [QuotationSupplierService],
    controllers: [QuotationSupplierController],
    exports: [QuotationSupplierService, TypeOrmModule],
})
export class QuotationSupplierModule { }