import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './user.entity';
import { SupplierModule } from 'src/supplier/supplier.module';
import { Supplier } from 'src/supplier/supplier.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([User, Supplier]),
        SupplierModule,
    ],
    providers: [UserService],
    controllers: [UserController],
    exports: [UserService, TypeOrmModule],
})
export class UserModule { }