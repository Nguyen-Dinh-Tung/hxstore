import {
  Body,
  Controller,
  Get,
  Post,
  UploadedFile,
  UseFilters,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { ProductService } from './product.service';
import { Public, ValidatorFilesPipe } from '@app/common';
import { CreateProductDto } from './dto/create-product.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileExceptionFillter } from '@app/exceptions';

@Controller('product')
@ApiTags('Product api')
@ApiBearerAuth()
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  async findAll() {
    return await this.productService.findAll();
  }

  @Post()
  @Public()
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
}
