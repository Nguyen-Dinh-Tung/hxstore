import { EmailOtpService } from '@app/common';
import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';

@Module({
  controllers: [ProductController],
  providers: [EmailOtpService, ProductService],
})
export class ProductModule {}
