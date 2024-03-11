import { CoreModule, EmailOtpService } from '@app/common';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ProductModule } from './product/product.module';

@Module({
  imports: [CoreModule, ConfigModule, ProductModule],
  providers: [EmailOtpService],
})
export class AppModule {}
