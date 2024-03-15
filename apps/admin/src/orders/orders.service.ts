import { Injectable } from '@nestjs/common';
import { FindAllOrdersDto } from './dto/find-all-orders.dto';
import {
  OrderDto,
  OrderPaginateDto,
  OrdersEntity,
  PageMeta,
  ProductsEntity,
} from '@app/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, Like, Repository } from 'typeorm';
import { UpdateOrderDto } from './dto/update-order.dto';
import { AppHttpBadRequest, OrderErrors, ProductErrors } from '@app/exceptions';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(OrdersEntity)
    private readonly ordersRepo: Repository<OrdersEntity>,
    @InjectRepository(ProductsEntity)
    private readonly productRepo: Repository<ProductsEntity>,
  ) {}

  async findAll(query: FindAllOrdersDto) {
    const findOptions: FindManyOptions<OrdersEntity> = {
      relations: {
        product: true,
      },
      take: query.limit,
      skip: query.skip,
    };

    if (query.phone) {
      findOptions.where['phone'] = query.phone;
    }

    if (query.keyword) {
      findOptions.where['product']['name'] = Like(`%${query.keyword}%`);
    }

    if (query.delivery) {
      findOptions.where['delivery'] = query.delivery;
    }

    const order = await this.ordersRepo.findAndCount(findOptions);

    return new OrderPaginateDto(
      order[0].map((e) => new OrderDto(e)),
      new PageMeta(query.page, order[1], query.limit),
    );
  }

  async getDetailOrder(id: number) {
    const order = await this.findOneOrderOrThrow({
      where: {
        id: id,
      },
      relations: {
        product: true,
      },
    });

    return {
      docs: new OrderDto(order),
    };
  }

  async findOneOrderOrThrow(options: FindOneOptions<OrdersEntity>) {
    const order = await this.ordersRepo.findOne(options);

    if (!order) {
      throw new AppHttpBadRequest(OrderErrors.ERROR_ORDER_NOT_FOUND);
    }

    return order;
  }

  async update(data: UpdateOrderDto) {
    await this.findOneOrderOrThrow({
      where: {
        id: data.id,
      },
    });

    const product = await this.productRepo.findOne({
      where: {
        id: data.productId,
      },
    });

    if (data.productId) {
      if (!product) {
        throw new AppHttpBadRequest(ProductErrors.ERROR_PRODUCT_NOT_FOUND);
      }

      data['product'] = product;
      delete data.productId;
    }

    if (data.amount > product.amount - product.totalSold) {
      throw new AppHttpBadRequest(OrderErrors.ERROR_AMOUNT_TO_LARGE);
    }

    await this.ordersRepo.update({ id: data.id }, data);

    return {
      success: true,
    };
  }
}
