import { UserEntity } from '@app/common';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, FindOneOptions, Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
  ) {}

  async findOne(options: FindOneOptions<UserEntity>) {
    return await this.userRepo.findOne(options);
  }

  async create(data: DeepPartial<UserEntity>) {
    return await this.userRepo.save(data);
  }
}
