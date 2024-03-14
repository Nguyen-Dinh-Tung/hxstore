import { ProductsEntity } from '@app/common';
import { Paginate } from '@app/common/dto/pagination.dto';
import { QueryDate } from '@app/common/dto/query.dto';
import {
  PositionRowEnum,
  PositionsScreenEnum,
  ProductEventTypes,
  ProductTypesEnum,
} from '@app/common/enum';
import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsNumberString,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class FindAllProductDto extends QueryDate {
  @IsOptional()
  @ApiPropertyOptional()
  @IsString()
  @Length(0, 255)
  name: string;

  @IsOptional()
  @ApiPropertyOptional({ enum: ProductTypesEnum })
  @IsEnum(ProductTypesEnum)
  type: ProductTypesEnum;

  @IsOptional()
  @ApiPropertyOptional()
  @IsNumberString()
  min: bigint;

  @IsOptional()
  @ApiPropertyOptional()
  @IsNumberString()
  max: bigint;
}

export class ProductDto {
  id: number;

  name: string;

  type: ProductTypesEnum;

  amount: number;

  price: number;

  totalSold: number;

  urlIMG: string;

  isActive: boolean;

  createdAt: Date;

  configId: number;

  configIsActive: boolean;

  positionsScreen: PositionsScreenEnum;

  positionsRow: PositionRowEnum;

  eventName: string;

  eventType: ProductEventTypes;

  saleRate: number;

  startDate: Date;

  endDate: Date;

  eventIsActive: boolean;

  constructor(entity: ProductsEntity) {
    this.id = entity.id;

    this.name = entity.name;

    this.type = entity.type;

    this.amount = Number(entity.amount);

    this.price = Number(entity.price);

    this.totalSold = Number(entity.totalSold);

    this.urlIMG = entity.urlIMG;

    this.isActive = entity.isActive;

    this.createdAt = entity.createdAt;

    this.configId = entity['configId'] ?? null;

    this.configIsActive = entity['configIsActive'] ?? null;

    this.positionsScreen = entity['positionsScreen'] ?? null;

    this.positionsRow = entity['positionsRow'] ?? null;

    this.eventName = entity['eventName'] ?? null;

    this.eventType = entity['eventType'] ?? null;

    this.saleRate = entity['saleRate'] ?? null;

    this.startDate = entity['startDate'] ?? null;

    this.endDate = entity['endDate'] ?? null;

    this.eventIsActive = entity['eventIsActive'] ?? null;
  }
}

export class ProductFindAllPaginateDto extends Paginate(ProductDto) {}
