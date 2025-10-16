import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';
import { ArrayMaxSize, IsEnum, IsNotEmpty, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { User } from 'src/user/user.entity';
import { QuotationItem } from 'src/quotation-item/quotation-item.entity';
import { QuotationSupplier } from 'src/quotation-supplier/quotation-supplier.entity';

export enum QuotationStatus {
    Pending = 'pending',
    InDecision = 'inDecision',
    Draft = 'draft',
    GeneratedRequest = 'generatedRequest',
    Canceled = 'canceled'
}

@Entity('quotations')
export class Quotation {
    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn()
    createdAt: Date;

    @Column({ length: 100 })
    @IsNotEmpty()
    code: string;

    @Column({ length: 255, nullable: true })
    description: string;

    @Column({ length: 100, default: QuotationStatus.Draft })
    @IsEnum(QuotationStatus)
    status: QuotationStatus;

    @Column({type: 'double'})
    @IsNumber()
    total: number;

    @IsNotEmpty()
    creator: User;

    @Column()
    @IsNumber()
    creatorId: number;

    @ArrayMaxSize(1500)
    @Type(() => QuotationItem)
    itens: QuotationItem[];

    @ArrayMaxSize(1500)
    @Type(() => QuotationSupplier)
    suppliers: QuotationSupplier[];
}