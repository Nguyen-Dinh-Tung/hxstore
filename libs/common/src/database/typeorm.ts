import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { makeTypeormOptions } from './options';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

export class DatabaseOptions implements TypeOrmOptionsFactory {
  public createTypeOrmOptions():
    | TypeOrmModuleOptions
    | Promise<TypeOrmModuleOptions> {
    return {
      ...makeTypeormOptions(),
      autoLoadEntities: true,
      // synchronize: true,
      retryAttempts: 2,
      namingStrategy: new SnakeNamingStrategy(),
    };
  }
}
