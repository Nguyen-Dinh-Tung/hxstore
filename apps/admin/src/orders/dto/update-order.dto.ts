import { DeliveryProductEnum, OrderStatusEnum } from '@app/common/enum';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class UpdateOrderDto {
  @IsNotEmpty()
  @ApiProperty()
  @IsNumber()
  @Min(1)
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
  @Min(1)
  amount: number;

  @IsOptional()
  @ApiPropertyOptional()
  @IsNumber()
  @Min(1)
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
