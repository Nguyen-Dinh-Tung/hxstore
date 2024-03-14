import { DeliveryProductEnum, OrderStatusEnum } from '@app/common/enum';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdateOrderDto {
  @IsNotEmpty()
  @ApiProperty()
  @IsNumber()
  id: number;

  @IsNotEmpty()
  @ApiProperty({ enum: OrderStatusEnum })
  @IsEnum(OrderStatusEnum)
  status: OrderStatusEnum;

  @IsOptional()
  @ApiPropertyOptional()
  @IsNumber()
  productId: number;

  @IsOptional()
  @ApiPropertyOptional()
  @IsNumber()
  amount: number;

  @IsOptional()
  @ApiPropertyOptional()
  @IsNumber()
  payAmount: number;

  @IsOptional()
  @ApiPropertyOptional()
  @IsString()
  fullname: string;

  @IsOptional()
  @ApiPropertyOptional()
  @IsString()
  phone: string;

  @IsOptional()
  @ApiPropertyOptional()
  @IsString()
  @IsEmail()
  email: string;

  @IsOptional()
  @ApiPropertyOptional()
  @IsString()
  address: string;

  @IsOptional()
  @ApiPropertyOptional({ enum: DeliveryProductEnum })
  @IsEnum(DeliveryProductEnum)
  delivery: DeliveryProductEnum;
}
