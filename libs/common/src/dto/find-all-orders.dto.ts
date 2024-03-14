import { OrdersEntity } from '../entities';
import { DeliveryProductEnum, OrderStatusEnum } from '../enum';
import { ProductDto } from './find-all-product.dto';
import { Paginate } from './pagination.dto';

export class OrderDto {
  id: number;

  product: ProductDto;

  amount: number;

  payAmount: number;

  fullname: string;

  phone: string;

  email: string;

  delivery: DeliveryProductEnum;

  status: OrderStatusEnum;

  constructor(entity: OrdersEntity) {
    this.id = entity.id;

    this.product = new ProductDto(entity?.product);

    this.amount = entity.amount;

    this.payAmount = entity.payAmount;

    this.fullname = entity.fullname;

    this.phone = entity.phone;

    this.email = entity.email;

    this.delivery = entity.delivery;

    this.status = entity.status;
  }
}

export class OrderPaginateDto extends Paginate(OrderDto) {}
