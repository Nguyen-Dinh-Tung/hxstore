import { Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { IdNumberDateEntity } from './id.entity';
import { IsActiveFalseColumn, NotNullColum, NullColumn } from '../database';
import { ProductEventTypes } from '../enum';
import { ProductsEntity } from './product.entity';

@Entity('event')
export class ProductEventEntity extends IdNumberDateEntity {
  @NotNullColum()
  startDate: Date;

  @NotNullColum()
  endDate: Date;

  @IsActiveFalseColumn()
  isActive: boolean;

  @NotNullColum()
  name: string;

  @NotNullColum({ type: 'enum', enum: ProductEventTypes })
  type: ProductEventTypes;

  @NullColumn()
  saleRate: number;

  @OneToMany(() => ProductsEntity, (product) => product.id, { nullable: true })
  @JoinColumn()
  productBonus: ProductsEntity[];

  @OneToOne(() => ProductsEntity, (product) => product.id, { nullable: true })
  @JoinColumn()
  product: ProductsEntity;
}
