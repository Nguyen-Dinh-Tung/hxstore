import { ProductEventTypes } from '@app/common/enum';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  ArrayMinSize,
  IsArray,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
} from 'class-validator';

export class CreateProductEventDto {
  @IsNotEmpty()
  @ApiProperty()
  @IsDateString()
  startDate: Date;

  @IsNotEmpty()
  @ApiProperty()
  @IsDateString()
  endDate: Date;

  @IsNotEmpty()
  @ApiProperty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @ApiProperty({ enum: ProductEventTypes })
  @IsEnum(ProductEventTypes)
  type: ProductEventTypes;

  @IsOptional()
  @ApiPropertyOptional()
  @IsNumber()
  @Min(0.0001)
  @Max(100)
  saleRate: number;

  @IsOptional()
  @ApiPropertyOptional()
  @IsArray()
  @ArrayMinSize(1)
  @IsUUID('all', { each: true })
  productIds: string[];

  @IsNotEmpty()
  @ApiProperty()
  @IsNumber()
  productId: number;
}
