import { Injectable } from '@nestjs/common';
import { CreateOrdersDto } from './dto/create-orders.dto';
import { InjectRepository } from '@nestjs/typeorm';
import {
  NodeMailerService,
  OrderDto,
  OrderPaginateDto,
  OrdersEntity,
  PageMeta,
  ProductsEntity,
} from '@app/common';
import { Repository } from 'typeorm';
import { AppHttpBadRequest, OrderErrors, ProductErrors } from '@app/exceptions';
import { FindAllOrdersDto } from './dto/find-all-orders.dto';

@Injectable()
export class OrdersService {
  constructor(
    private readonly nodemailService: NodeMailerService,

    @InjectRepository(OrdersEntity)
    private readonly ordersRepo: Repository<OrdersEntity>,
    @InjectRepository(ProductsEntity)
    private readonly productRepo: Repository<ProductsEntity>,
  ) {}

  async createOrder(data: CreateOrdersDto) {
    const delivery = {
      SLOW: 'Chậm',
      FAST: 'Nhanh',
      EXPRESS: 'Hỏa Tốc',
    };
    const product = await this.productRepo.findOne({
      where: {
        id: data.productId,
      },
    });

    if (!product) {
      throw new AppHttpBadRequest(ProductErrors.ERROR_PRODUCT_NOT_FOUND);
    }

    if (data.amount > product.amount - product.totalSold) {
      throw new AppHttpBadRequest(OrderErrors.ERROR_AMOUNT_TO_LARGE);
    }

    const payAmount = data.amount * Number(product.price);

    data['product'] = product;

    delete data.productId;

    await this.ordersRepo.save(
      this.ordersRepo.create({
        ...data,
        payAmount: payAmount,
        createdAt: new Date().toISOString(),
      }),
    );

    if (data.email) {
      await this.nodemailService.send({
        address: data.email,
        title: 'Đơn đặt sản phẩm Sinhlyshop90',
        content: `Cảm ơn quý khách ${data.fullname}
Đã đặt sản phẩm ${product.name}
Địa chỉ nhận : ${data.address}
Số điện thoại : ${data.phone}
Giá thành : ${payAmount}
Số lượng : ${data.amount}
Số lượng : ${data.amount}
Chuyển phát : ${delivery[data.delivery]}
Sản phẩm sẽ được gửi đến quý khách ít ngày tới !
Xin Cảm ơn .
                `,
      });
    }

    await this.nodemailService.send({
      address: data.email,
      title: 'Đơn đặt sản phẩm Sinhlyshop90',
      content: `Khách hàng ${data.fullname}
Đã đặt sản phẩm ${product.name}
Địa chỉ nhận : ${data.address}
Số điện thoại : ${data.phone}
Giá thành : ${payAmount}
Số lượng : ${data.amount}
Số lượng : ${data.amount}
Chuyển phát : ${delivery[data.delivery]}
Check chốt đơn .
                `,
    });

    return {
      success: true,
    };
  }

  async findAll(query: FindAllOrdersDto) {
    const order = await this.ordersRepo.findAndCount({
      where: {
        phone: query.phone,
      },
      relations: {
        product: true,
      },
    });

    return new OrderPaginateDto(
      order[0].map((e) => new OrderDto(e)),
      new PageMeta(query.page, order[1], query.limit),
    );
  }
}
