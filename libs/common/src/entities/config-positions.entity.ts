import { Entity, JoinColumn, OneToOne } from 'typeorm';
import { IdNumberDateEntity } from './id.entity';
import { IsActiveFalseColumn, NotNullColum } from '../database';
import { PositionRowEnum, PositionsScreenEnum } from '../enum';
import { ProductsEntity } from './product.entity';

@Entity('config_positions')
export class ConfigPositionsEntity extends IdNumberDateEntity {
  @IsActiveFalseColumn()
  isActive: boolean;

  @NotNullColum({ enum: PositionsScreenEnum, type: 'enum' })
  positionsScreen: PositionsScreenEnum;

  @NotNullColum({ enum: PositionRowEnum, type: 'enum' })
  positionsRow: PositionRowEnum;

  @OneToOne(() => ProductsEntity, (product) => product.id)
  @JoinColumn()
  product: ProductsEntity;
}
