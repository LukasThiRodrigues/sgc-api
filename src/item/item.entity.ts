import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';
import { IsNotEmpty } from 'class-validator';

@Entity('items')
export class Item {
    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn()
    createdAt: Date;

    @Column({ length: 100 })
    @IsNotEmpty()
    item: string;

    @Column({ length: 255 })
    description: string;

    @Column({ length: 100 })
    code: string;

    @Column({ length: 100 })
    unit: string;

}