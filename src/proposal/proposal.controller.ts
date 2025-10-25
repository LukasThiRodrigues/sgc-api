import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Delete,
    Query,
    Put
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ProposalService } from './proposal.service';
import { Proposal } from './proposal.entity';

@ApiTags('proposals')
@ApiBearerAuth()
@Controller('proposals')
export class ProposalController {
    constructor(private readonly proposalService: ProposalService) { }

    @Post()
    create(@Body() body: Proposal) {
        return this.proposalService.create(body);
    }

    @Get()
    findAll(@Query('page') page: number = 1, @Query('limit') limit: number = 10, @Query('supplierId') supplierId?: number) {
        return this.proposalService.findAll(page, limit, supplierId);
    }

    @Get(':id')
    findOne(@Param('id') id: number) {
        return this.proposalService.findById(id);
    }

    @Put(':id')
    update(@Param('id') id: number, @Body() body: Proposal) {
        return this.proposalService.update(id, body);
    }

    @Delete(':id')
    remove(@Param('id') id: number) {
        return this.proposalService.remove(id);
    }
}