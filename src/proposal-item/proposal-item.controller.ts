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
import { ProposalItemService } from './proposal-item.service';
import { ProposalItem } from './proposal-item.entity';

@ApiTags('proposals_items')
@ApiBearerAuth()
@Controller('proposals_items')
export class ProposalItemController {
    constructor(private readonly proposalItemService: ProposalItemService) { }

    @Post()
    create(@Body() body: ProposalItem) {
        return this.proposalItemService.create(body);
    }

    @Get()
    findAll(@Query('page') page: number = 1, @Query('limit') limit: number = 10, @Query('search') search?: string) {
        return this.proposalItemService.findAll(page, limit, search);
    }

    @Get(':id')
    findOne(@Param('id') id: number) {
        return this.proposalItemService.findById(id);
    }

    @Put(':id')
    update(@Param('id') id: number, @Body() body: ProposalItem) {
        return this.proposalItemService.update(id, body);
    }

    @Delete(':id')
    remove(@Param('id') id: number) {
        return this.proposalItemService.remove(id);
    }
}