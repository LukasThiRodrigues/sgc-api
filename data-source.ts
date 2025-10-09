import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User } from './src/user/user.entity';
import { Supplier } from './src/supplier/supplier.entity';
import { Item } from './src/item/item.entity';
import { Request } from './src/request/request.entity';
import { RequestItem } from './src/request-item/request-item.entity';

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 3306,
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'rootroot',
  database: process.env.DB_NAME || 'SGC',
  synchronize: false,
  entities: [User, Supplier, Item, Request, RequestItem],
  migrations: ['./migrations/*.ts'],
});
