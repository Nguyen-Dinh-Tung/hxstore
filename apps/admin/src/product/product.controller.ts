import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseFilters,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { ProductService } from './product.service';
import { ValidatorFilesPipe } from '@app/common';
import { CreateProductDto } from './dto/create-product.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileExceptionFillter } from '@app/exceptions';
import { FindAllProductDto } from './dto/find-all-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { SetPositionsProductDto } from './dto/set-positions-products.dto';
import { UpdatePositionsProductDto } from './dto/accept-positions-product.dto';

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
}
