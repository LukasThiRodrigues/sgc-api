import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { User } from 'src/user/user.entity';

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

    @IsNotEmpty()
    creator: User;

    @Column()
    @IsNumber()
    creatorId: number;

}