import { ProductTypesEnum } from '@app/common/enum';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class UpdateProductDto {
  @IsOptional()
  @ApiPropertyOptional()
  @IsString()
  @Length(0, 255)
  name: string;

  @IsOptional()
  @ApiPropertyOptional()
  @IsString()
  @Length(0, 255)
  origin: string;

  @IsOptional()
  @ApiPropertyOptional()
  @IsString()
  @Length(0, 255)
  company: string;

  @IsOptional()
  @ApiPropertyOptional()
  @IsString()
  @Length(0, 255)
  placeOfProduction: string;

  @IsOptional()
  @ApiPropertyOptional({ enum: ProductTypesEnum })
  @IsEnum(ProductTypesEnum)
  type: ProductTypesEnum;

  @IsOptional()
  @ApiPropertyOptional()
  @IsNumberString()
  amount: bigint;

  @IsOptional()
  @ApiPropertyOptional()
  @IsNumberString()
  price: bigint;

  @IsNotEmpty()
  @ApiProperty()
  @IsNumberString()
  id: number;

  @ApiPropertyOptional({ type: String, format: 'binary' })
  file;
}
