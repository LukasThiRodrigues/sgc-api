import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { Item } from 'src/item/item.entity';
import { Request } from 'src/request/request.entity';

@Entity('requests_items')
export class RequestItem {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    @IsNumber()
    quantity: number;

    @Column({type: 'double'})
    @IsNumber()
    price: number;

    @Column({type: 'double'})
    @IsNumber()
    total: number;

    @IsNotEmpty()
    item: Item;

    @Column()
    @IsNumber()
    itemId: number;

    @Column()
    @IsNumber()
    requestId: number;

}