import {
  EventDto,
  EventPaginateDto,
  FindAllEventDto,
  FindAllProductDto,
  ProductFindAllPaginateDto,
  ProductsEntity,
} from '@app/common';
import {
  compareStartAndEndDateWithCurrentDate,
  saveImage,
} from '@app/common/helpers';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  DataSource,
  FindManyOptions,
  FindOneOptions,
  In,
  Like,
  Repository,
} from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import {
  AppHttpBadRequest,
  ConfigErrors,
  EventError,
  FileErrors,
  ProductErrors,
} from '@app/exceptions';

import { UpdateProductDto } from './dto/update-product.dto';
import { SetPositionsProductDto } from './dto/set-positions-products.dto';
import { ConfigPositionsEntity } from '@app/common/entities/config-positions.entity';
import { UpdatePositionsProductDto } from './dto/accept-positions-product.dto';
import { PageMeta } from '@app/common/dto/pagination.dto';
import { CreateProductEventDto } from './dto/create-product-event.dto';
import { ProductEventEntity } from '@app/common/entities/product-event.entity';
import { UpdateProductEventDto } from './dto/update-product-event.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductsEntity)
    private productRepo: Repository<ProductsEntity>,

    @InjectRepository(ConfigPositionsEntity)
    private configPositionsRepo: Repository<ConfigPositionsEntity>,

    @InjectRepository(ProductEventEntity)
    private productEventRepo: Repository<ProductEventEntity>,

    private readonly dataSource: DataSource,
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
        'product.place_of_production as placeOfProduction ',
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

  async create(data: CreateProductDto, file: Express.Multer.File) {
    if (file) {
      data.urlIMG = saveImage(file, 'uploads/images/products/');
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

  async update(data: UpdateProductDto, file: Express.Multer.File) {
    let product = await this.findOneOrThrowNotFound({
      where: {
        id: data.id,
      },
    });

    if (file) {
      product.urlIMG = saveImage(file, 'uploads/images/products/');
    }

    product = { ...product, ...data };

    await this.productRepo.update({ id: product.id }, product);

    return {
      success: true,
    };
  }

  async findOneOrThrowNotFound(
    options: FindOneOptions<ProductsEntity>,
    message?: string,
  ) {
    const product = await this.productRepo.findOne(options);

    if (!product) {
      throw new AppHttpBadRequest(
        message ?? ProductErrors.ERROR_PRODUCT_NOT_FOUND,
      );
    }

    return product;
  }

  async setPositions(data: SetPositionsProductDto) {
    const product = await this.findOneOrThrowNotFound({
      where: {
        id: data.id,
      },
    });

    await this.findOneConfigOrThrowNotFound(
      {
        where: {
          positionsRow: data.positionsRow,
          positionsScreen: data.positionsScreen,
        },
      },
      false,
    );

    await this.configPositionsRepo.save(
      this.configPositionsRepo.create({
        ...data,
        product: product,
        createdAt: new Date().toISOString(),
      }),
    );

    return {
      success: true,
    };
  }

  async updatePositions(data: UpdatePositionsProductDto) {
    await this.findOneConfigOrThrowNotFound(
      {
        where: {
          id: data.id,
        },
      },
      true,
    );

    await this.configPositionsRepo.update(
      { id: data.id },
      { ...data, updatedAt: new Date().toISOString() },
    );

    return {
      success: true,
    };
  }

  async findOneConfigOrThrowNotFound(
    options: FindOneOptions<ConfigPositionsEntity>,
    exist: boolean,
  ) {
    const config = await this.configPositionsRepo.findOne(options);

    if (config && !exist) {
      throw new AppHttpBadRequest(ConfigErrors.ERROR_EXISTED_ORD_CONFIG);
    }

    if (!config && exist) {
      throw new AppHttpBadRequest(
        ConfigErrors.ERROR_CONFIG_POSITIONS_NOT_FOUND,
      );
    }

    return config;
  }

  async createProductEvent(data: CreateProductEventDto) {
    compareStartAndEndDateWithCurrentDate(data.startDate, data.endDate);

    await this.findOneProductEventOrThrow(
      { productId: data.productId },
      'NOT-EXIST',
    );

    const productMain = await this.findOneOrThrowNotFound({
      where: { id: data.productId },
    });

    data['product'] = productMain;

    if (data.productIds && data.productIds.length) {
      data['productBonus'] = await this.findProductsOrThrow(data);
    }

    delete data.productId;
    delete data.productIds;

    await this.dataSource.transaction(async (em) => {
      await em.getRepository(ProductEventEntity).save(
        this.productEventRepo.create({
          ...data,
          createdAt: new Date().toISOString(),
        }),
      );
    });

    return {
      success: true,
    };
  }

  private async findProductsOrThrow(data: CreateProductEventDto) {
    const productBonus = await this.productRepo.find({
      where: {
        id: In(data.productIds),
      },
    });

    if (productBonus.length !== data.productIds.length) {
      throw new AppHttpBadRequest(ProductErrors.ERROR_MISSING_PRODUCT);
    }

    return productBonus;
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

  async updateProductEvent(data: UpdateProductEventDto) {
    const event = await this.findOneProductEventOrThrow(
      { id: data.id },
      'EXIST',
    );

    const product = await this.findOneOrThrowNotFound({
      where: {
        id: data.productId,
      },
    });

    if (data.productIds && data.productIds.length) {
      data['productBonus'] = await this.findProductsOrThrow(data);
    }
    data['product'] = product;

    delete data.productId;
    delete data.productIds;

    await this.productEventRepo.update({ id: event.id }, data);

    return {
      success: true,
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

  async getDetailEvent(id: number) {
    const event = await this.findOneProductEventOrThrow({ id: id }, 'EXIST');

    return {
      docs: new EventDto(event),
    };
  }
}
