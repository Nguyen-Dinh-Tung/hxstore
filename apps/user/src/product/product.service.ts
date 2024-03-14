import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  EventDto,
  EventPaginateDto,
  FindAllEventDto,
  FindAllProductDto,
  PageMeta,
  ProductEventEntity,
  ProductFindAllPaginateDto,
  ProductsEntity,
} from '@app/common';
import { FindManyOptions, FindOneOptions, Like, Repository } from 'typeorm';
import { ConfigPositionsEntity } from '@app/common/entities/config-positions.entity';
import { AppHttpBadRequest, EventError, ProductErrors } from '@app/exceptions';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductsEntity)
    private readonly productRepo: Repository<ProductsEntity>,
    @InjectRepository(ProductEventEntity)
    private readonly productEventRepo: Repository<ProductEventEntity>,
  ) {}

  async findAll(query: FindAllProductDto) {
    const configProduct = await this.getConfigProduct();

    const { queryBuilder, products } = await this.getProductsAndQuery(
      query,
      configProduct.map((e) => e.id),
      configProduct.length,
    );

    if (query.page === 1 && configProduct.length) {
      for (let i = 0; i < configProduct.length; i++) {
        products.splice(configProduct[i]['positionsRow'], 0, configProduct[i]);
      }
    }

    const total = await queryBuilder.getCount();

    return new ProductFindAllPaginateDto(
      products,
      new PageMeta(query.page, total, query.limit),
    );
  }

  async getConfigProduct() {
    const configProduct = await this.productRepo
      .createQueryBuilder('product')
      .leftJoinAndSelect(
        ConfigPositionsEntity,
        'config',
        'config.product_id = product.id',
      )
      .leftJoin(ProductEventEntity, 'event', 'event.product_id = product.id')
      .select([
        'product.id as id ',
        'product.name as name ',
        'product.type as type ',
        'product.amount as amount ',
        'product.price as price ',
        'product.total_sold as totalSold ',
        'product.url_img as urlIMG ',
        'product.is_active as isActive ',
        'product.created_at as createdAt ',
        'config.id as configId ',
        'config.is_active as configIsActive ',
        'config.positions_screen as positionsScreen ',
        'config.positions_row as positionsRow ',
        'event.created_at as createdAt ',
        'event.name as eventName ',
        'event.type as eventType ',
        'event.saleRate as saleRate ',
        'event.startDate as startDate ',
        'event.endDate as endDate ',
        'event.isActive as eventIsActive ',
      ])
      .where('config.id is not null')
      .getRawMany();

    return configProduct;
  }

  private async getProductsAndQuery(
    query: FindAllProductDto,
    ids: string[],
    configTotal: number,
  ) {
    const queryBuilder = this.productRepo
      .createQueryBuilder('product')
      .leftJoin(ProductEventEntity, 'event', 'event.product_id = product.id')
      .limit(query.limit - configTotal)
      .offset(query.skip)
      .orderBy('product.created_at', query.order)
      .select([
        'product.id as id ',
        'product.name as name ',
        'product.type as type ',
        'product.amount as amount ',
        'product.price as price ',
        'product.total_sold as totalSold ',
        'product.url_img as urlIMG ',
        'product.is_active as isActive ',
        'product.created_at as createdAt ',
      ]);
    if (query.keyword) {
      queryBuilder.where('product.name LIKE :keyword', {
        keyword: `%${query.keyword}%`,
      });
    }

    if (query.type) {
      queryBuilder.andWhere('product.type = :type', { type: query.type });
    }

    if (query.min) {
      queryBuilder.andWhere('product.price >= :min', { min: query.min });
    }

    if (query.max) {
      queryBuilder.andWhere('product.price <= :max', { max: query.max });
    }

    if (ids.length) {
      queryBuilder.andWhere('product.id NOT IN (:...ids)', { ids: ids });
    }

    const products = await queryBuilder.getRawMany();

    return { queryBuilder, products };
  }

  async getDetailProduct(id: number) {
    const product = await this.productRepo.findOne({
      where: {
        id: id,
      },
      relations: {
        event: true,
        bonusEvent: true,
      },
    });

    if (!product) {
      throw new AppHttpBadRequest(ProductErrors.ERROR_PRODUCT_NOT_FOUND);
    }

    return {
      docs: product,
    };
  }

  async findAllEvent(query: FindAllEventDto) {
    const findOption = {
      relations: {
        product: true,
        productBonus: true,
      },
      take: query.limit,
      skip: query.skip,
    } as FindManyOptions<ProductEventEntity>;

    if (query.isActive !== undefined) {
      findOption.where['isActive'] = query.isActive;
    }

    if (query.keyword) {
      findOption.where['name'] = Like(`%${query.keyword}%`);
    }

    if (query.type) {
      findOption.where['type'] = query.type;
    }

    const data = await this.productEventRepo.findAndCount(findOption);

    return new EventPaginateDto(
      data[0].map((e) => new EventDto(e)),
      new PageMeta(query.page, query.limit, data[1]),
    );
  }

  async getDetailEvent(id: number) {
    const event = await this.findOneProductEventOrThrow({ id: id }, 'EXIST');

    return {
      docs: new EventDto(event),
    };
  }

  private async findOneProductEventOrThrow(
    data: { productId?: number; id?: number },
    status: 'EXIST' | 'NOT-EXIST',
  ) {
    const where = {} as FindOneOptions<ProductEventEntity>;

    if (data.productId) {
      where.where['product'] = {
        id: data.productId,
      };
    }

    if (data.id) {
      where.where['id'] = data.id;
    }

    const productEvent = await this.productEventRepo.findOne(where);

    if (productEvent && status === 'NOT-EXIST') {
      throw new AppHttpBadRequest(EventError.ERROR_EXISTED_EVENT);
    } else if (!productEvent && status === 'EXIST') {
      throw new AppHttpBadRequest(EventError.ERROR_EVENT_NOT_FOUND);
    }

    return productEvent;
  }
}
