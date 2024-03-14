import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseFilters,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { ProductService } from './product.service';
import {
  FindAllEventDto,
  FindAllProductDto,
  ValidatorFilesPipe,
} from '@app/common';
import { CreateProductDto } from './dto/create-product.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileExceptionFillter } from '@app/exceptions';
import { UpdateProductDto } from './dto/update-product.dto';
import { SetPositionsProductDto } from './dto/set-positions-products.dto';
import { UpdatePositionsProductDto } from './dto/accept-positions-product.dto';
import { CreateProductEventDto } from './dto/create-product-event.dto';
import { UpdateProductEventDto } from './dto/update-product-event.dto';

@Controller('product')
@ApiTags('Product api')
@ApiBearerAuth()
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  async findAll(@Query() query: FindAllProductDto) {
    return await this.productService.findAll(query);
  }

  @Post()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  @UseFilters(FileExceptionFillter)
  async create(
    @Body() data: CreateProductDto,
    @UploadedFile(new ValidatorFilesPipe(['jpg', 'png', 'jpeg']))
    file: Express.Multer.File,
  ) {
    return await this.productService.create(data, file);
  }

  @Patch()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  @UseFilters(FileExceptionFillter)
  async update(
    @Body() data: UpdateProductDto,
    @UploadedFile(new ValidatorFilesPipe(['jpg', 'png', 'jpeg']))
    file: Express.Multer.File,
  ) {
    return await this.productService.update(data, file);
  }

  @Post('positions')
  async setPositions(@Body() data: SetPositionsProductDto) {
    return await this.productService.setPositions(data);
  }

  @Patch('positions')
  async updatePositions(@Body() data: UpdatePositionsProductDto) {
    return await this.productService.updatePositions(data);
  }

  @Post('event')
  async createProductEvent(@Body() data: CreateProductEventDto) {
    return await this.productService.createProductEvent(data);
  }

  @Patch('event')
  async updateProductEvent(@Body() data: UpdateProductEventDto) {
    await this.productService.updateProductEvent(data);
  }

  @Get('find-all/event')
  async findAllEvent(@Query() query: FindAllEventDto) {
    return await this.productService.findAllEvent(query);
  }

  @Get('detail/:id')
  async getDetailProduct(@Param('id') id: number) {
    return await this.productService.getDetailProduct(id);
  }

  @Get('event/detail/:id')
  async getDetailEvent(@Param(':id') id: number) {
    return await this.productService.getDetailEvent(id);
  }
}
