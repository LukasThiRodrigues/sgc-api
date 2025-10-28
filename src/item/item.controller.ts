import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Delete,
    UseGuards,
    Query,
    Put,
    Request as RequestCommon
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ItemService } from './item.service';
import { Item } from './item.entity';

@ApiTags('items')
@ApiBearerAuth()
@Controller('items')
export class ItemController {
    constructor(private readonly itemService: ItemService) { }

    @Post()
    create(@Body() body: Item) {
        return this.itemService.create(body);
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    findAll(@Query('page') page: number = 1, @Query('limit') limit: number = 10, @Query('search') search?: string, @RequestCommon() req?) {
        return this.itemService.findAll(page, limit, search, req.user.userId);
    }

    @Get(':id')
    findOne(@Param('id') id: number) {
        return this.itemService.findById(id);
    }

    @Put(':id')
    update(@Param('id') id: number, @Body() body: Item) {
        return this.itemService.update(id, body);
    }

    @Delete(':id')
    remove(@Param('id') id: number) {
        return this.itemService.remove(id);
    }
}