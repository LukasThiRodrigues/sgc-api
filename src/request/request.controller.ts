import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Delete,
    Query,
    Put,
    UseGuards,
    Request as RequestCommon
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { RequestService } from './request.service';
import { Request } from './request.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@ApiTags('requests')
@ApiBearerAuth()
@Controller('requests')
export class RequestController {
    constructor(private readonly requestService: RequestService) { }

    @Post()
    create(@Body() body: Request) {
        return this.requestService.create(body);
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    findAll(@Query('page') page: number = 1, @Query('limit') limit: number = 10, @Query('search') search?: string, @Query('supplierId') supplierId?: number, @RequestCommon() req?) {
        return this.requestService.findAll(page, limit, search, supplierId, req.user.userId);
    }

    @Get(':id')
    findOne(@Param('id') id: number) {
        return this.requestService.findById(id);
    }

    @Put(':id')
    update(@Param('id') id: number, @Body() body: Request) {
        return this.requestService.update(id, body);
    }

    @Delete(':id')
    remove(@Param('id') id: number) {
        return this.requestService.remove(id);
    }
}