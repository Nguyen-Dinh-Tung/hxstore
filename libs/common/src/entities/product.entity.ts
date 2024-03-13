import { Entity } from 'typeorm';
import { IdNumberDateEntity } from './id.entity';
import { IsActiveFalseColumn, NotNullColum } from '../database';
import { ProductTypesEnum } from '../enum';

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
}
