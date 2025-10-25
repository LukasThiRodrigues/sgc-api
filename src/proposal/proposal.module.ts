import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProposalService } from './proposal.service';
import { Proposal } from './proposal.entity';
import { ProposalController } from './proposal.controller';
import { ItemModule } from 'src/item/item.module';
import { SupplierModule } from 'src/supplier/supplier.module';
import { ProposalItemModule } from 'src/proposal-item/proposal-item.module';

@Module({
    imports: [TypeOrmModule.forFeature([Proposal]), ItemModule, SupplierModule, ProposalItemModule],
    providers: [ProposalService],
    controllers: [ProposalController],
    exports: [ProposalService, TypeOrmModule],
})
export class ProposalModule { }