import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { ProductModule } from './product/product.module';
import { CoreModule } from '@app/common';

@Module({
  imports: [CoreModule, UserModule, ConfigModule.forRoot(), ProductModule],
})
export class AppModule {}
