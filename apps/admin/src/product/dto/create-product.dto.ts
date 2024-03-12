import { ProductTypesEnum } from '@app/common/enum';
import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsNumberString,
  IsString,
  Length,
} from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty()
  @ApiProperty()
  @IsString()
  @Length(0, 255)
  name: string;

  @IsNotEmpty()
  @ApiProperty({ enum: ProductTypesEnum })
  @IsEnum(ProductTypesEnum)
  type: ProductTypesEnum;

  @IsNotEmpty()
  @ApiProperty()
  @IsNumberString()
  amount: bigint;

  @IsNotEmpty()
  @ApiProperty()
  @IsNumberString()
  price: bigint;

  @ApiProperty({ type: String, format: 'binary' })
  file;

  urlIMG;
}
