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
import { RequestItemService } from './request-item.service';
import { RequestItem } from './request-item.entity';

@ApiTags('requests_items')
@ApiBearerAuth()
@Controller('requests_items')
export class RequestItemController {
    constructor(private readonly requestItemService: RequestItemService) { }

    @Post()
    create(@Body() body: RequestItem) {
        return this.requestItemService.create(body);
    }

    @Get()
    findAll(@Query('page') page: number = 1, @Query('limit') limit: number = 10, @Query('search') search?: string) {
        return this.requestItemService.findAll(page, limit, search);
    }

    @Get(':id')
    findOne(@Param('id') id: number) {
        return this.requestItemService.findById(id);
    }

    @Put(':id')
    update(@Param('id') id: number, @Body() body: RequestItem) {
        return this.requestItemService.update(id, body);
    }

    @Delete(':id')
    remove(@Param('id') id: number) {
        return this.requestItemService.remove(id);
    }
}