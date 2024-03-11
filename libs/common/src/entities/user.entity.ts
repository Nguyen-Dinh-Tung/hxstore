import { NotNullColum } from '../database';
import { IdDateEntity } from './id.entity';

export class UserEntity extends IdDateEntity {
  @NotNullColum()
  username: string;

  @NotNullColum()
  password: string;
}
