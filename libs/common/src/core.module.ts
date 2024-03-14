import { DynamicModule, Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseOptions } from './database';
import { OrdersEntity, ProductsEntity, UserEntity } from './entities';
import { ConfigPositionsEntity } from './entities/config-positions.entity';
import { ProductEventEntity } from './entities/product-event.entity';
@Module({})
@Global()
export class CoreModule {
  static forRoot(): DynamicModule {
    return {
      module: CoreModule,
      imports: [
        TypeOrmModule.forRootAsync({
          useClass: DatabaseOptions,
        }),
        //   Push entity use global
        TypeOrmModule.forFeature([
          ProductsEntity,
          UserEntity,
          ConfigPositionsEntity,
          ProductEventEntity,
          OrdersEntity,
        ]),
      ],
      exports: [TypeOrmModule],
    };
  }
}
