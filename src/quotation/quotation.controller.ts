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
import { QuotationService } from './quotation.service';
import { Quotation } from './quotation.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@ApiTags('quotations')
@ApiBearerAuth()
@Controller('quotations')
export class QuotationController {
    constructor(private readonly quotationService: QuotationService) { }

    @Post()
    create(@Body() body: Quotation) {
        return this.quotationService.create(body);
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    findAll(@Query('page') page: number = 1, @Query('limit') limit: number = 10, @Query('search') search?: string, @Query('supplierId') supplierId?: number, @RequestCommon() req?) {
        return this.quotationService.findAll(page, limit, search, supplierId, req.user.userId);
    }

    @Get(':id')
    findOne(@Param('id') id: number) {
        return this.quotationService.findById(id);
    }

    @Put(':id')
    update(@Param('id') id: number, @Body() body: Quotation) {
        return this.quotationService.update(id, body);
    }

    @Delete(':id')
    remove(@Param('id') id: number) {
        return this.quotationService.remove(id);
    }
}