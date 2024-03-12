import { DynamicModule, Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseOptions } from './database';
import { ProductsEntity, UserEntity } from './entities';
import { ConfigPositionsEntity } from './entities/config-positions.entity';
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
        ]),
      ],
      exports: [TypeOrmModule],
    };
  }
}
