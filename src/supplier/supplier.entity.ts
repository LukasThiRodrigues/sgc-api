import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';
import { IsEnum, IsNotEmpty } from 'class-validator';

export enum SupplierStatus {
    Invited = 'invited',
    Active = 'active',
    Inactive = 'inactive',
}

@Entity('suppliers')
export class Supplier {
    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn()
    createdAt: Date;

    @Column({ length: 100 })
    @IsNotEmpty()
    name: string;

    @Column({ length: 255 })
    cnpj: string;

    @Column({ length: 100, default: SupplierStatus.Inactive })
    @IsEnum(SupplierStatus)
    status: SupplierStatus;

    @Column({ length: 100 })
    contactEmail: string;

}