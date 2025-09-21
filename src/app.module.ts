import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { User } from './user/user.entity';
import { ItemModule } from './item/item.module';
import { Item } from './item/item.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('DB_HOST', 'localhost'),
        port: configService.get('DB_PORT', 3306),
        username: configService.get('DB_USER', 'root'),
        password: configService.get('DB_PASSWORD', 'rootroot'),
        database: configService.get('DB_NAME', 'SGC'),
        entities: [User, Item],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    UserModule,
    ItemModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
