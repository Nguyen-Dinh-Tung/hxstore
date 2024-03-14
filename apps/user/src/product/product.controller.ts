import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ProductService } from './product.service';
import { FindAllEventDto, FindAllProductDto, Public } from '@app/common';

@Controller('product')
@ApiBearerAuth()
@ApiTags('Product api')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get('find-all')
  @Public()
  async findAll(@Query() query: FindAllProductDto) {
    return await this.productService.findAll(query);
  }

  @Get('detail/:id')
  async getDetailProduct(@Param(':id') id: number) {
    return await this.productService.getDetailProduct(id);
  }

  @Get('find-all/event')
  async findAllEvent(@Query() query: FindAllEventDto) {
    return this.productService.findAllEvent(query);
  }

  @Get('detail/event/:id')
  async getDetailEvent(@Param('id') id: number) {
    return await this.productService.getDetailEvent(id);
  }
}
