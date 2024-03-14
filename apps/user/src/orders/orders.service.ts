import { Injectable } from '@nestjs/common';
import { CreateOrdersDto } from './dto/create-orders.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { NodeMailerService, OrdersEntity, ProductsEntity } from '@app/common';
import { Repository } from 'typeorm';
import { AppHttpBadRequest, ProductErrors } from '@app/exceptions';

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
    const product = await this.productRepo.findOne({
      where: {
        id: data.productId,
      },
    });

    if (!product) {
      throw new AppHttpBadRequest(ProductErrors.ERROR_PRODUCT_NOT_FOUND);
    }

    data['product'] = product;

    delete data.productId;

    await this.ordersRepo.save(this.ordersRepo.create(data));

    if (data.email) {
      await this.nodemailService.send({
        address: data.email,
        title: 'Đơn đặt sản phẩm',
        content: `Cảm ơn quý khách
                    Đã đặt sản phẩm ${product.name}
                    Giá thành : ${data.payAmount}
                    Số lượng : ${data.amount}
                    Chuyển phát : ${data.delivery}
                    Sản phẩm sẽ được gửi đến quý khách ít ngày tới !
                    Xin Cảm ơn .
                `,
      });
    }

    await this.nodemailService.send({
      address: `${process.env.EMAIL_APP}@gmail.com`,
      title: 'Đơn đặt sản phẩm',
      content: `Cảm ơn quý khách
                  Đã đặt sản phẩm ${product.name}
                  Giá thành : ${data.payAmount}
                  Số lượng : ${data.amount}
                  Chuyển phát : ${data.delivery}
                  Sản phẩm sẽ được gửi đến quý khách ít ngày tới !
                  Xin Cảm ơn .
              `,
    });

    return {
      success: true,
    };
  }
}
