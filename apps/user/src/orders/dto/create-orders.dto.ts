import { DeliveryProductEnum } from '@app/common/enum';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Min,
} from 'class-validator';

export class CreateOrdersDto {
  @IsNotEmpty()
  @ApiProperty()
  @IsNumber()
  productId: number;

  @IsNotEmpty()
  @ApiProperty()
  @IsNumber()
  @Min(1)
  amount: number;

  @IsNotEmpty()
  @ApiProperty()
  @IsString()
  fullname: string;

  @IsNotEmpty()
  @ApiProperty()
  @IsString()
  @IsPhoneNumber('VN')
  phone: string;

  @IsNotEmpty()
  @ApiProperty({ enum: DeliveryProductEnum })
  @IsEnum(DeliveryProductEnum)
  delivery: DeliveryProductEnum;

  @IsOptional()
  @ApiPropertyOptional()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @ApiProperty()
  @IsString()
  address: string;
}
