import { Entity, ManyToMany, OneToMany, OneToOne } from 'typeorm';
import { IdNumberDateEntity } from './id.entity';
import { IsActiveFalseColumn, NotNullColum } from '../database';
import { ProductTypesEnum } from '../enum';
import { ProductEventEntity } from './product-event.entity';
import { OrdersEntity } from './orders.entity';

@Entity('products')
export class ProductsEntity extends IdNumberDateEntity {
  @NotNullColum({})
  name: string;

  @NotNullColum({ type: 'enum', enum: ProductTypesEnum })
  type: ProductTypesEnum;

  @NotNullColum({ type: 'bigint', default: 0 })
  amount: bigint;

  @NotNullColum({ type: 'bigint', default: 0 })
  price: bigint;

  @NotNullColum({ type: 'bigint', default: 0 })
  totalSold: bigint;

  @NotNullColum()
  origin: string;

  @NotNullColum()
  company: string;

  @NotNullColum()
  placeOfProduction: string;

  @NotNullColum()
  urlIMG: string;

  @IsActiveFalseColumn()
  isActive: boolean;

  @ManyToMany(() => ProductEventEntity, (event) => event.productBonus, {
    nullable: true,
  })
  bonusEvent: ProductEventEntity[];

  @OneToOne(() => ProductEventEntity, (event) => event.product)
  event: ProductEventEntity;

  @OneToMany(() => OrdersEntity, (order) => order.product, { nullable: true })
  orders: OrdersEntity[];
}
