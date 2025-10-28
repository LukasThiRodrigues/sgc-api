import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';
import { ArrayMaxSize, IsEnum, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { RequestItem } from 'src/request-item/request-item.entity';
import { Supplier } from 'src/supplier/supplier.entity';
import { User } from 'src/user/user.entity';
import { Quotation } from 'src/quotation/quotation.entity';
import { Proposal } from 'src/proposal/proposal.entity';

export enum RequestStatus {
    Pending = 'pending',
    SupplierAccepted = 'supplierAccepted',
    SupplierRejected = 'supplierRejected',
    Draft = 'draft',
    Delivered = 'delivered',
    Canceled = 'canceled'
}

@Entity('requests')
export class Request {
    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn()
    createdAt: Date;

    @Column({ length: 100 })
    @IsNotEmpty()
    code: string;

    @Column({ length: 255, nullable: true })
    description: string;

    @Column({ type: 'timestamp', nullable: true })
    @IsOptional()
    deliveredAt: Date;

    @Column({ nullable: true })
    @IsOptional()
    reason: string;

    @Column({ length: 100, default: RequestStatus.Draft })
    @IsEnum(RequestStatus)
    status: RequestStatus;

    @Column({type: 'double'})
    @IsNumber()
    total: number;

    @IsNotEmpty()
    creator: User;

    @Column()
    @IsNumber()
    creatorId: number;

    @Column()
    @IsNumber()
    supplierId: number;

    @Column({ nullable: true })
    @IsNumber()
    @IsOptional()
    quotationId: number;

    @Column({ nullable: true })
    @IsNumber()
    @IsOptional()
    proposalId: number;

    @ArrayMaxSize(1500)
    @Type(() => RequestItem)
    itens: RequestItem[];

    @ArrayMaxSize(1500)
    @Type(() => Supplier)
    supplier: Supplier;

    @ArrayMaxSize(1500)
    @Type(() => Quotation)
    quotation: Quotation;

    @ArrayMaxSize(1500)
    @Type(() => Proposal)
    proposal: Proposal;
}