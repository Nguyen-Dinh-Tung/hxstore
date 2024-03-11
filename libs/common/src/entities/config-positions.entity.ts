import { Entity } from 'typeorm';
import { IdNumberDateEntity } from './id.entity';
import { IsActiveFalseColumn, NotNullColum } from '../database';
import { PositionRowEnum, PositionsScreenEnum } from '../enum';

@Entity('config_positions')
export class ConfigPositionsEntity extends IdNumberDateEntity {
  @IsActiveFalseColumn()
  isActive: boolean;

  @NotNullColum({ enum: PositionsScreenEnum, type: 'enum' })
  positionsScreen: PositionsScreenEnum;

  @NotNullColum({ enum: PositionRowEnum, type: 'enum' })
  positionsRow: PositionRowEnum;
}
