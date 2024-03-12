import { ProductsEntity } from '@app/common';
import { saveImage } from '@app/common/helpers';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { AppHttpBadRequest, FileErrors } from '@app/exceptions';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductsEntity)
    private productRepo: Repository<ProductsEntity>,
  ) {}

  async findAll() {}

  async create(data: CreateProductDto, file: Express.Multer.File) {
    if (file) {
      data.urlIMG = saveImage(file, 'uploads/images/products');
    } else {
      throw new AppHttpBadRequest(FileErrors.ERROR_MISSING_FILE);
    }

    data.amount = BigInt(data.amount);
    data.price = BigInt(data.price);
    await this.productRepo.save(
      this.productRepo.create({ ...data, createdAt: new Date().toISOString() }),
    );

    return {
      success: true,
    };
  }
}
