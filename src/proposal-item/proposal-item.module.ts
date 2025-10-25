import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProposalItemService } from './proposal-item.service';
import { ProposalItem } from './proposal-item.entity';
import { ProposalItemController } from './proposal-item.controller';

@Module({
    imports: [TypeOrmModule.forFeature([ProposalItem])],
    providers: [ProposalItemService],
    controllers: [ProposalItemController],
    exports: [ProposalItemService, TypeOrmModule],
})
export class ProposalItemModule { }