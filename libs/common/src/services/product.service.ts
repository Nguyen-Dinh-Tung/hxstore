import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from './base.service';
import { ProductsEntity } from '../entities';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { FindAllProductDto } from '../dto';

export class BaseProductService extends BaseService {
  constructor(
    @InjectRepository(ProductsEntity)
    protected productRepo: Repository<ProductsEntity>,
  ) {
    super();
  }

  getFindAllSelect(query: FindAllProductDto) {
    const queryBuilder: SelectQueryBuilder<ProductsEntity> = this.getBaseQuery(
      query,
      'product',
      this.productRepo,
    );

    if (query.type) {
      queryBuilder.andWhere('product.type = :type', { type: query.type });
    }

    if (query.min) {
      queryBuilder.andWhere('product.price >= :min', { min: query.min });
    }

    if (query.max) {
      queryBuilder.andWhere('product.price <= :max', { max: query.max });
    }
    return queryBuilder;
  }
}
