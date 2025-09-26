import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn()
    createdAt: Date;

    @Column({ length: 100 })
    @IsNotEmpty()
    name: string;

    @Column({ unique: true, length: 100 })
    @IsEmail()
    email: string;

    @Column({ length: 255 })
    @MinLength(6)
    password: string;

    @Column({ nullable: true })
    supplierId: number;

}