import { Injectable } from '@nestjs/common';
import { QueryDto } from '../dto';
import { Repository, SelectQueryBuilder } from 'typeorm';

@Injectable()
export class BaseService {
  getBaseQuery(query: QueryDto, alias: string, repo: Repository<any>) {
    const queryBuilder: SelectQueryBuilder<any> =
      repo.createQueryBuilder(alias);

    queryBuilder.offset(query.skip).orderBy(`${alias}.created_at`, query.order);

    if (query.keyword) {
      queryBuilder.where(`${alias}.name LIKE :keyword`, {
        keyword: `%${query.keyword}%`,
      });
    }

    return queryBuilder;
  }
}
