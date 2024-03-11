import { ProductsEntity } from '@app/common';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductsEntity)
    private productRepo: Repository<ProductsEntity>,
  ) {}

  async findAll() {}

  async create(data: CreateProductDto, file: Express.Multer.File) {}
}
