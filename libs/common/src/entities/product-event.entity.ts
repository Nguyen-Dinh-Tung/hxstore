import { Entity } from 'typeorm';
import { IdNumberDateEntity } from './id.entity';
import { NotNullColum } from '../database';

@Entity('event')
export class ProductEventEntity extends IdNumberDateEntity {
  @NotNullColum()
  startDate: Date;

  @NotNullColum()
  endDate: Date;
}
