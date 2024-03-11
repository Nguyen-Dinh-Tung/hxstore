import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { NodemailerModule } from '@app/common/modules';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    NodemailerModule,
    MulterModule.register({
      dest: './uploads/images/products',
      limits: {
        fieldSize: Infinity,
      },
    }),
  ],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
