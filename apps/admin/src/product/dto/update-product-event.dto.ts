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

export class UpdateProductEventDto {
  @IsOptional()
  @ApiPropertyOptional()
  @IsDateString()
  startDate: Date;

  @IsOptional()
  @ApiPropertyOptional()
  @IsDateString()
  endDate: Date;

  @IsOptional()
  @ApiPropertyOptional()
  @IsString()
  name: string;

  @IsOptional()
  @ApiPropertyOptional({ enum: ProductEventTypes })
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

  @IsNotEmpty()
  @ApiProperty()
  @IsNumber()
  id: number;
}
