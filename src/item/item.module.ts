import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Item } from './item.entity';
import { ItemService } from './item.service';
import { ItemController } from './item.controller';

@Module({
    imports: [TypeOrmModule.forFeature([Item])],
    providers: [ItemService],
    controllers: [ItemController],
    exports: [ItemService, TypeOrmModule],
})
export class ItemModule { }