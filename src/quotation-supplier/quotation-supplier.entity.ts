import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { Supplier } from 'src/supplier/supplier.entity';
import { Quotation } from 'src/quotation/quotation.entity';

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

    @ManyToOne(() => Quotation, quotation => quotation.suppliers)
    quotation: Quotation;

}