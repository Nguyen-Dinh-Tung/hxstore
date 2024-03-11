import { Entity } from 'typeorm';
import { IdNumberDateEntity } from './id.entity';
import { IsActiveFalseColumn, NotNullColum } from '../database';
import { ProductTypesEnum } from '../enum';

@Entity('products')
export class ProductsEntity extends IdNumberDateEntity {
  @NotNullColum({ type: 'varchar' })
  name: string;

  @NotNullColum({ enum: ProductTypesEnum, type: 'enum' })
  type: ProductTypesEnum;

  @NotNullColum({ type: 'bigint' })
  amount: bigint;

  @NotNullColum({ type: 'bigint' })
  price: bigint;

  @NotNullColum({ type: 'bigint' })
  totalSold: bigint;

  @NotNullColum()
  urlIMG: string;

  @IsActiveFalseColumn()
  isActive: boolean;
}
