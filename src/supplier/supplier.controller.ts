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
import { SupplierService } from './supplier.service';
import { Supplier } from './supplier.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@ApiTags('suppliers')
@ApiBearerAuth()
@Controller('suppliers')
export class SupplierController {
    constructor(private readonly supplierService: SupplierService) { }

    @Post()
    create(@Body() body: Supplier) {
        return this.supplierService.create(body);
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    findAll(@Query('page') page: number = 1, @Query('limit') limit: number = 10, @Query('search') search?: string,  @RequestCommon() req?) {
        return this.supplierService.findAll(page, limit, search, req.user.userId);
    }

    @Get(':id')
    findOne(@Param('id') id: number) {
        return this.supplierService.findById(id);
    }

    @Put(':id')
    update(@Param('id') id: number, @Body() body: Supplier) {
        return this.supplierService.update(id, body);
    }

    @Delete(':id')
    remove(@Param('id') id: number) {
        return this.supplierService.remove(id);
    }
}