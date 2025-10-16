import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { Supplier } from 'src/supplier/supplier.entity';

@Entity('quotations_suppliers')
export class QuotationSupplier {
    @PrimaryGeneratedColumn()
    id: number;

    @IsNotEmpty()
    supplier: Supplier;

    @Column()
    @IsNumber()
    supplierId: number;

    @Column()
    @IsNumber()
    quotationId: number;

}