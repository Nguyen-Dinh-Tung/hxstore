import { Entity, JoinColumn, ManyToOne } from 'typeorm';
import { IdNumberDateEntity } from './id.entity';
import { ProductsEntity } from './product.entity';
import { NotNullColum, NullColumn } from '../database';
import { DeliveryProductEnum, OrderStatusEnum } from '../enum';

@Entity('orders')
export class OrdersEntity extends IdNumberDateEntity {
  @ManyToOne(() => ProductsEntity, (product) => product.orders)
  @JoinColumn()
  product: ProductsEntity;

  @NotNullColum({ type: 'bigint' })
  amount: number;

  @NotNullColum({ type: 'bigint' })
  payAmount: number;

  @NotNullColum()
  fullname: string;

  @NotNullColum()
  phone: string;

  @NullColumn()
  email: string;

  @NotNullColum()
  address: string;

  @NotNullColum({ type: 'enum', enum: DeliveryProductEnum })
  delivery: DeliveryProductEnum;

  @NotNullColum({ type: 'enum', enum: OrderStatusEnum })
  status: OrderStatusEnum;
}
