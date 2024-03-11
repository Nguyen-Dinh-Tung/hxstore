import {
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export class UUIDEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
}

export class IdNumberEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;
}

export class IdNumberDateEntity extends IdNumberEntity {
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
