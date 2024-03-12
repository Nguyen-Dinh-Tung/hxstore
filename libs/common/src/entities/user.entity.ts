import { Entity } from 'typeorm';
import { NotNullColum } from '../database';
import { IdDateEntity } from './id.entity';

@Entity('user')
export class UserEntity extends IdDateEntity {
  @NotNullColum()
  username: string;

  @NotNullColum()
  password: string;
}
