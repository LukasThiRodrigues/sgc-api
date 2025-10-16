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
import { QuotationSupplierService } from './quotation-supplier.service';
import { QuotationSupplier } from './quotation-supplier.entity';

@ApiTags('quotations_suppliers')
@ApiBearerAuth()
@Controller('quotations_suppliers')
export class QuotationSupplierController {
    constructor(private readonly quotationSupplierService: QuotationSupplierService) { }

    @Post()
    create(@Body() body: QuotationSupplier) {
        return this.quotationSupplierService.create(body);
    }

    @Get()
    findAll(@Query('page') page: number = 1, @Query('limit') limit: number = 10, @Query('search') search?: string) {
        return this.quotationSupplierService.findAll(page, limit, search);
    }

    @Get(':id')
    findOne(@Param('id') id: number) {
        return this.quotationSupplierService.findById(id);
    }

    @Put(':id')
    update(@Param('id') id: number, @Body() body: QuotationSupplier) {
        return this.quotationSupplierService.update(id, body);
    }

    @Delete(':id')
    remove(@Param('id') id: number) {
        return this.quotationSupplierService.remove(id);
    }
}