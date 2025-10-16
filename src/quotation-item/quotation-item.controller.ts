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
import { QuotationItemService } from './quotation-item.service';
import { QuotationItem } from './quotation-item.entity';

@ApiTags('quotations_items')
@ApiBearerAuth()
@Controller('quotations_items')
export class QuotationItemController {
    constructor(private readonly quotationItemService: QuotationItemService) { }

    @Post()
    create(@Body() body: QuotationItem) {
        return this.quotationItemService.create(body);
    }

    @Get()
    findAll(@Query('page') page: number = 1, @Query('limit') limit: number = 10, @Query('search') search?: string) {
        return this.quotationItemService.findAll(page, limit, search);
    }

    @Get(':id')
    findOne(@Param('id') id: number) {
        return this.quotationItemService.findById(id);
    }

    @Put(':id')
    update(@Param('id') id: number, @Body() body: QuotationItem) {
        return this.quotationItemService.update(id, body);
    }

    @Delete(':id')
    remove(@Param('id') id: number) {
        return this.quotationItemService.remove(id);
    }
}