import { Public } from '@app/common';
import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { CreateOrdersDto } from './dto/create-orders.dto';
import { FindAllOrdersDto } from './dto/find-all-orders.dto';

@Controller('orders')
@ApiTags('Orders api')
@ApiBearerAuth()
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post('')
  @Public()
  async createOrder(@Body() data: CreateOrdersDto) {
    return await this.ordersService.createOrder(data);
  }

  @Get('')
  async findAll(@Query() query: FindAllOrdersDto) {
    return await this.ordersService.findAll(query);
  }
}
