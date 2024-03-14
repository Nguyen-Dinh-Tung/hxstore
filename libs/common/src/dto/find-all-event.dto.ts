import { QueryDate } from './query.dto';
import { Paginate } from './pagination.dto';
import { ProductEventTypes } from '@app/common/enum';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEnum, IsOptional } from 'class-validator';
import { ProductDto } from './find-all-product.dto';
import { ProductEventEntity } from '@app/common';

export class FindAllEventDto extends QueryDate {
  @IsOptional()
  @ApiPropertyOptional()
  @Transform((data) => data.value === 'true')
  isActive: boolean;

  @IsOptional()
  @ApiPropertyOptional({ enum: ProductEventTypes })
  @IsEnum(ProductEventTypes)
  type: ProductEventTypes;
}

export class EventDto {
  id: number;

  createdAt: Date;

  startDate: Date;

  endDate: Date;

  isActive: boolean;

  name: string;

  type: ProductEventTypes;

  saleRate: number;

  product: ProductDto;

  productBonus: ProductDto[];

  constructor(entity: ProductEventEntity) {
    this.id = entity.id;

    this.createdAt = entity.createdAt;

    this.startDate = entity.startDate;

    this.endDate = entity.endDate;

    this.isActive = entity.isActive;

    this.name = entity.name;

    this.type = entity.type;

    this.saleRate = entity.saleRate;

    this.product = new ProductDto(entity.product);

    this.productBonus = entity.productBonus.map((e) => new ProductDto(e));
  }
}

export class EventPaginateDto extends Paginate(EventDto) {}
