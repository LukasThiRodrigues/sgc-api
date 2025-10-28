import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';
import { ArrayMaxSize, IsNumber, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { ProposalItem } from 'src/proposal-item/proposal-item.entity';
import { Supplier } from 'src/supplier/supplier.entity';
import { Quotation } from 'src/quotation/quotation.entity';
import { Request } from 'src/request/request.entity';

@Entity('proposals')
export class Proposal {
    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn()
    createdAt: Date;

    @Column({type: 'double'})
    @IsNumber()
    total: number;

    @ArrayMaxSize(1500)
    @Type(() => ProposalItem)
    itens: ProposalItem[];

    @Column()
    @IsNumber()
    supplierId: number;

    @ArrayMaxSize(1500)
    @Type(() => Supplier)
    supplier: Supplier;

    @Column()
    @IsNumber()
    quotationId: number;

    @ArrayMaxSize(1500)
    @Type(() => Quotation)
    quotation: Quotation;

    @ArrayMaxSize(1500)
    @Type(() => Request)
    request: Request;
}