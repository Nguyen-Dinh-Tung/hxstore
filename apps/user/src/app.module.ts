import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { ProductModule } from './product/product.module';
import { CoreModule } from '@app/common';
import { OrdersModule } from './orders/orders.module';

@Module({
  imports: [
    CoreModule,
    UserModule,
    ConfigModule.forRoot(),
    ProductModule,
    OrdersModule,
  ],
})
export class AppModule {}
