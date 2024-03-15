import { Body, Controller, Get, Param, Patch, Query } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { FindAllOrdersDto } from './dto/find-all-orders.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UpdateOrderDto } from './dto/update-order.dto';

@Controller('orders')
@ApiTags('Orders api')
@ApiBearerAuth()
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get('find-all')
  async findAll(@Query() query: FindAllOrdersDto) {
    return await this.ordersService.findAll(query);
  }

  @Get('detail/:id')
  async getDetailOrder(@Param('id') id: number) {
    return await this.ordersService.getDetailOrder(id);
  }

  @Patch('')
  async update(@Body() data: UpdateOrderDto) {
    return await this.ordersService.update(data);
  }
}
