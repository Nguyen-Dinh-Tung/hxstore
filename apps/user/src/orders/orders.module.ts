import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { NodemailerModule } from '@app/common';

@Module({
  imports: [NodemailerModule],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
